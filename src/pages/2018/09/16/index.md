---
title: Gatsby製ブログでSNS対応(SNSシェアボタン、OGPタグ追加)
date: "2018-09-16T22:00:00.000Z"
---

## なにこれ
Gatsby製ブログでSNS対応を実施した時のメモです。<br>
**(1) SNSシェアボタン設置**して **(2) 自分のSNSへのリンク設置**することでブログフッターの見栄えがちょっと良い感じになりました。
  ![ブログフッタ](./blog-footer.png)

またSNSシェア時にわかりやすくするためにOGPタグなるものを設定しました。Twitterで呟くと画像、タイトル、記事概要を表示できるようになります。<br>はてなブログとかQiitaみたいな感じですね。
  ![つぶやきサンプル](./tweet-sample.png)

##  SNSシェアボタンを設置
TODO 手順記載

## 自分のSNSへのリンクを設置
TODO 手順記載

## OGPタグを設定
OGPとは、「Open Graph Protcol」の略でFacebookやTwitterなどのSNSでシェアした際に、
WEBページのタイトルやイメージ画像、説明文などをわかりやすく伝えるためのHTML要素です。
OGPをWebページで設定することでユーザーに対してWEBページの内容を詳しく伝えることができます。

### OGPタグ定義
このブログはReactを使って書かれているので、ReactHelmetを使ってOPG専用のコンポーネントを作りました。
ブログのトップと記事詳細で設定する値が違うので、そこは引数でとれるようにしてあります。

```jsx{13,18-27}
import React from 'react'
import Helmet from 'react-helmet'

import {
  blogTitle,
  blogUrl,
  blogDescription,
  blogImageUrl,
  facebookAppId,
  blogAuthorTwitterUserName,
} from '../config/blog-config.js';

export default function Ogp({isRoot, title, description}) {
  const type = isRoot ? 'website' : 'article';

  return(
    <Helmet>
      <meta property="og:title" content={title || blogTitle} />
      <meta property="og:description" content={description || blogDescription} />

      <meta property="og:url" content={blogUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={blogTitle} />
      <meta property="og:image" content={blogImageUrl} />
      <meta property="fb:app_id" content={facebookAppId} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={`@${blogAuthorTwitterUserName}`} />
    </Helmet>
  )
}
```
※`blog-config.js`はブログタイトルなどの設定を外出しした設定ファイル
いろいろあるプロパティは下記の通り

|プロパティ名|説明|
|:--|:--|
|og:title|ページのタイトル。SNS共有時は、headのtitleタグよりも優先して使われます。|
|og:description|ページの説明。|
|og:url|ページのURL。|
|og:type|ページの属性、だいたい`website`か`article`を指定します。詳細は[ココ](http://ogp.me/#types)参照|
|og:site_name|Webサイト名。|
|og:image|ページのイメージ画像|
|fb:app_id|FacebookのアプリID。FacebookでOGPを表示させる際に必須。アプリIDの取り方は[FacebookのOGP設定に必要なfb:app IDの取得方法](https://design-plus1.com/tcd-w/2018/01/facebook_app_id.html)参照。|
|twitter:card|OGPのレイアウトのタイプ。詳細は[【2018年版】Twitterカードとは？使い方と設定方法まとめ](https://saruwakakun.com/html-css/reference/twitter-card)参照。|
|twitter:site|Twitterのユーザ名。|


### OGPタグ呼び出し
タイトルやURLはページ個別で設定が必要です。
Gatsby製ブログでは下記2カ所でOGPタグを呼び出します。

#### 1. ブログトップページでの呼び出し
**src/layouts/index.js**<br>
※全体のテンプレートなのでURLがブログトップページの時のみOGPタグを呼び出します。
```jsx
<Ogp isRoot={isRoot} />
```

#### 2. ブログ記事ページでの呼び出し
**src/templates/blog-post.js**
```jsx{4}
<Ogp isRoot={isRoot} />
  isRoot={false}
  title={`${post.frontmatter.title} | ${siteTitle}`}
  description={sumarrize(post.html)}/>
```

4行目の`sumarrize`メソッドではブログ記事(HTML形式)から[striptags](https://github.com/ericnorris/striptags)というライブラリを使ってテキストを抽出し、冒頭120文字を1行にして返すようにしています。
```jsx
function sumarrize(html) {
  const postContent = striptags(html).replace(/\r?\n/g, '').trim();
  return postContent.length <= 120
    ? postContent
    : postContent.slice(0, 120) + '...';
}
```

※[striptags](https://github.com/ericnorris/striptags)は非常に便利なライブラリですが、1点だけ注意点があって、最新バージョンの3系(2018/9/16現在)はGatsbyビルド時にエラーになるため**2系を使用してください**。Gatsbyではビルド時に[Uglifyjs](https://github.com/mishoo/UglifyJS2)を使用しているためES6のコードをコンパイルできません。

これでTwitterやFacebookで呟くと下記のようにいい感じに画像とタイトル、説明文を表示してくれるようになります。
  ![つぶやきサンプル](./tweet-sample.png)


## まとめ
今回はGatsby製ブログでSNSシェアボタンや自分のSNSへのリンクを設置し、さらにOGPタグを設置して
TwitterやFacebookなどでのシェアをより効果的にする方法をメモとして残しました。
GatsbyはReact製ということもあり、かなり簡単に実現できますし、グっとブログっぽくなるので是非みなさんも挑戦してみてください。

## 参考

* OGPタグ系関連
    * 参考にしたサイト
        * [Facebook・TwitterのOGP設定方法まとめ｜ferret [フェレット]](https://ferret-plus.com/610)
        * [React Helmetを使ってOGP対応した | akameco Blog](https://akameco.github.io/blog/react-helmet/)
        * [FacebookのOGP設定に必要なfb:app IDの取得方法](https://design-plus1.com/tcd-w/2018/01/facebook_app_id.html)
    * 下記で実際の表示結果のプレビューが確認できます。
        * Twitter → [Card validator](https://cards-dev.twitter.com/validator)
        * Facebook → [シェアデバッガー](https://developers.facebook.com/tools/debug/)
    * [striptags](https://github.com/ericnorris/striptags)
        * HTML文字列から単純テキストを抽出してくれるライブラリです。
    * [GatsbyはES6未対応 | GitHub issues](https://github.com/gatsbyjs/gatsby/issues/3780)
        * GatsbyはビルドでJSファイル最初化時にUglifyを使っており、uglifyがES6未対応なのでES6のコードをコンパイルしようとするとエラーになってしまいます。




