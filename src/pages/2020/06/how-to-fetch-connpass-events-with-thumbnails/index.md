---
title: 'Connpass APIでサムネイル付きのイベント情報を取得する方法'
date: '2020-06-22T08:00:00.000+09:00'
tags:
  - Connpass
  - Node.js
keywords:
  - Connpass
slug: /how-to-fetch-connpass-events-with-thumbnails
thumbnail: thumbnail/2020/06/how-to-fetch-connpass-events-with-thumbnails.png
---

## なにこれ
Gatsby製のサイトでConnpassのイベントを表示しなければならず、[Conpass API](https://connpass.com/about/api/)を使ったのですが、こちらのAPIではサムネイル画像が取得できません。そのためサムネイルはスクレイピングで取得するようにしました。取得自体は単純なNode.jsのスクリプトなので割と使いまわしが効くと思います。今回はその備忘録です。ついでにGatsbyのローカルプラグインにする方法もご紹介します。

## Connpass API所感

少しだけ使いづらいです。<br/>
今回、グループに紐づくイベントを取得したかったので`series_id`を指定しましたが、Connpassのグループの画面からは`series_id`がわからず、グループに紐づくイベントをConnpass APIで叩いて、そのレスポンスの`series_id`を確認する必要がありました。<br/>
日付の範囲指定が独特で、From Toではなく、年月または年月日を整数で複数指定しなければなりません。
2020年1月から3月までのイベントを取得する場合は`ym=202001, 202001, 202003`のような感じです。<br/>
なお取得件数のデフォルトは10件なので、たくさんイベントを取得する場合は100件を指定する必要があります。

そしてサムネイル画像の情報がレスポンスで返ってきません。
返ってきても良さそうですが、[Connpass APIのページ](https://connpass.com/about/api/)で紹介されているAPIを使っているサービスを見ても、サムネイル画像を表示しているサービスはなかったで、おそらくAPIでは取得できないのでしょう。


## 現在月前後のイベントを取得するための検索条件

先に述べた通り日付の検索条件が独特で、
ここでは、現在月から過去Xヶ月、未来Yヶ月の範囲を指定する方法を示します。
念の為、どんなロケーションでも正しく動くように[date-fns](https://date-fns.org/)という日時ライブラリを使っています。

```js:title=param-of-month-range.js(Connpass APIの年月のパラメータを生成する処理)
// 時間計算などの処理は日本のタイムゾーンで行う
const TIME_ZONE_FOR_CONNPASS_API = 'Asia/Tokyo';
const YEAR_MONTH_FORMAT_FOR_CONNPASS_API = 'YYYYMM';
const { startOfMonth, addMonths, format } = require('date-fns');
const { convertToTimeZone } = require('date-fns-timezone');

// Connpass APIの仕様(https://connpass.com/about/api/)に従って
// 最近開催された/されるイベントに絞り込むためのパラメーターを生成する
// 結果は `202001,202002,202003` のような文字列
function paramOfMonthRange(monthRangePast, monthRangeFuture) {
  const targetYearAndMonths = [];
  const startOfCurrentMonth = startOfMonth(convertToTimeZone(new Date(), { timeZone: TIME_ZONE_FOR_CONNPASS_API }));

  for(let i = - monthRangePast; i < monthRangeFuture; i++) {
    const target = addMonths(startOfCurrentMonth, i);
    const targetStr = format(target, YEAR_MONTH_FORMAT_FOR_CONNPASS_API);
    targetYearAndMonths.push(targetStr);
  }

  return targetYearAndMonths.join(',');
}


exports.paramOfMonthRange = paramOfMonthRange;
```
<br/>


## サムネイルのスクレイピング

まずはConnpass APIでイベント情報を取得して、
取得情報の中のイベントページのURLを元に、[cheerio](https://github.com/cheeriojs/cheerio)を使ってイベントページHTMLのheadタグのmeta情報からOGP画像のURLを取得します。
スクレイピングで503エラーにならないようPromise.allで並列処理で一気に投げることはせず、for文で1つづつ順番にリクエストを送るようにしています。

```js:title=fetch-connpass-events-with-thumbnails.js
const axios = require('axios');
const cheerio = require('cheerio');
const { paramOfMonthRange } = require('./param-of-month-range.js')


const BASE_URL = 'https://connpass.com/api/v1/event/';
const DEFAULT_MIN_FETCH_COUNT = 1;
const DEFAULT_MAX_FETCH_COUNT = 100;


async function fetchConnpassEventsWithThumbnails({
  eventSeriesIds,
  defaultThumbnailUrl,
  maxFetchCount,
  monthRangePast,
  monthRangeFuture,
}) {
  // 引数チェックは省略

  const eventsList = await Promise.all(eventSeriesIds.map(async series_id => {
    const response = await axios.get(BASE_URL, {
      params: {
        series_id,
        ym: paramOfMonthRange(monthRangePast, monthRangeFuture),
        count: maxFetchCount,
      }
    });

    return attachThumbnailUrl(response.data.events, defaultThumbnailUrl);
  }));

  return eventsList.flat();
}


async function attachThumbnailUrl(events, defaultThumbnailUrl) {
  const eventUrls = events.map(event => event.event_url);
  const thumbnailUrls = await fetchThumbnailUrls(eventUrls);

  // 取得したOGP画像のURLをイベント情報にマージ
  return events.map(event => {
    const  thumbnail_url = thumbnailUrls[event.event_url] || defaultThumbnailUrl;
    return Object.assign({}, event, { thumbnail_url });
  });
}


// スクレイピングでHTMLのheadのmeta情報からOGP画像のURLを取得する
async function fetchThumbnailUrls(eventUrls) {
  const result = {};
  // 503エラー(リクエスト過多)にならないようPromise.allで並列処理はせず、for文で直列で処理する
  for (const url of eventUrls) {
    try {
      const { data: html } = await axios(url);
      const $ = cheerio.load(html);
      const thumbnailUrl = $('meta[property="og:image"]').attr('content');
      if (thumbnailUrl) {
        result[url] = thumbnailUrl;
      } else {
        console.warn(`OGP image cloud not found in the url(${url}).`)
      }
    } catch (e) {
      console.warn(`Fetching(${url}) for getting thumbnail url failed.`, e);
    }
  }

  return result;
}

exports.fetchConnpassEventsWithThumbnails = fetchConnpassEventsWithThumbnails;
```
<br/>

## Gatsbyプラグインにする場合

Gatsbyのビルド時にConnpassのイベント情報を取得してコンポーネントのGraphQLのクエリで取得できるようにするためには以下を実施します。
- 設定ファイル定義
- gatsby-config.jsでプラグイン登録
- Gatsbyローカルプラグインを作成、この中で先程のスクリプト`fetch-connpass-events-with-thumbnails.js`を使う
<br/>

まずはプラグインに渡す引数を設定ファイルで定義します。
```js:title=config/connpass-events.js
module.exports = {
  // 自分が取得したいグループIDのSeriesIDを記載する
  eventSeriesIds: [ '1234',  '5678',],
  // サムネイルがないを考慮して、デフォルトのサムネイル画像のURLを指定する
  defaultThumbnailUrl: 'https://hogehoge.com/default-thumbnaile-url.png',
  maxFetchCount: 100,
  monthRangePast: 3,
  monthRangeFuture: 1,
};
```
<br/>

次に`gatsby-config.js`でプラグインを登録します。この時、設定ファイルの値をオプションとして指定します。
```js{9-15}:title=gatsby-config.js
const connpassEvents = require('./config/conpass-events');

module.exports = {

  plugins: [
    // 中略
    {
      resolve: `gatsby-source-connpass`,
      options: {
        eventSeriesIds: connpassEvents.eventSeriesIds,
        defaultThumbnailUrl: connpassEvents.defaultThumbnailUrl,
        maxFetchCount: connpassEvents.maxFetchCount,
        monthRangePast: connpassEvents.monthRangePast,
        monthRangeFuture: connpassEvents.monthRangeFuture,
      },
    },
    // 中略
  ],
};
```
<br/>

プラグインを定義します。プラグインは`plugins/プラグイン名`のフォルダ配下に定義します。
Node.jsプロジェクトなので、これの他にもpackage.jsonなどの定義が必要です。

```js:title=plugins/gatsby-source-connpass/gatsby-node.js
const crypto = require("crypto");
const { fetchConnpassEventsWithThumbnails } = require('fetch-connpass-events-with-thumbnails.js');

const INTERNAL_TYPE = 'connpassEvent';
const DEFAULT_MAX_FETCH_COUNT = 100;
const DEFAULT_MIN_FETCH_COUNT = 1;


// 指定したイベントグループ(eventSeriesIds)のイベントをサムネイル付きで取得する
exports.sourceNodes = async (
  { actions, createNodeId },
  // Plugin options
  { 
    eventSeriesIds,
    defaultThumbnailUrl,
    maxFetchCount,
    monthRangePast,
    monthRangeFuture,
  }
) => {

  // 引数チェックは省略

  const events = await fetchConnpassEventsWithThumbnails({
    eventSeriesIds,
    defaultThumbnailUrl,
    maxFetchCount,
    monthRangePast,
    monthRangeFuture,
  })


  // Connpassイベント情報をNodeに追加して、
  // コンポーネントからGraphQLのクエリで取得できるようにする
  events.forEach(event => {
    const contentDigest =
      crypto.createHash(`md5`)
            .update(JSON.stringify(event))
            .digest('hex');

    actions.createNode({
      ...event,
      thumbnail_url: event.thumbnail_url,
      id: createNodeId(`${INTERNAL_TYPE}${event.event_id}`),
      children: [],
      parent: `__SOURCE__`,
      internal: {
        type: INTERNAL_TYPE,
        contentDigest,
      },
    });
  });
};
```
<br/>

これにより、Gatsbyでビルドする時に、Connpassイベントがサムネイル画像のURL付きでNodeに登録されて、コンポーネントのGraphQLのクエリでConnpassイベントが取得できるようになります。


## まとめ

所感にも書いた通り、Connpass APIは使いやすいとは言えません。
標準でサムネイル画像のURLをサポートしてくれたらいいのですが、残念ながらそうではないので、今回のスクリプトを書くに至りました。今後もどこかの場面でこのスクリプトを流用しそうです。ただ、ReactアプリでConnpassのイベントを検索したい場合などのリアルタイム性が求められるユースケースでは、スクレイピングに時間がかかるので、サムネイルだけLazyLoadするような仕組みが必要かと思います🍅

## 参考

- [APIリファレンス - connpass](https://connpass.com/about/api/)