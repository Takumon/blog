---
title: unifiedでMarkdownをHTMLに変換 & ReactでQiitaっぽい目次を作る
date: "2018-10-28T21:00:00.000Z"
tags:
  - React
  - unified
  - remark
  - rehype
---

## なにこれ
自分のブログの目次をQiitaっぽくしたくて、
スクロールに追従して現在表示中のしている章をハイライトする目次を作りました。
マークダウン文字列解析に[unified](https://unified.js.org/)というライブラリを使っています。その時のメモ。<br>
*参考： Reactサンプルの[ソース](https://github.com/Takumon/react-markdown-sync-toc)と[デモ](https://takumon.github.io/react-markdown-sync-toc/)*

![scroll](./scroll-sync-toc.gif)

## ポイント
* マークダウンのHTML化と目次抽出には[unified](https://unified.js.org/)を使いました。
* スクロールの度に現在表示中の章をチェックして目次ハイライトを更新しています。
  * スクロール処理は高負荷なので負荷軽減のためにLodashのthrottleを使いました。
  * 表示中の章が切り替わるごとに再描画するためにReactのstateを使いました。



## unified
アプリの実装を説明する前にマークダウン構文解析に使っているunifiedについて説明します。<br>
unifiedは構文木を使ってテキストを処理するためのインタフェースです。
* 文字列をパーサーで構文木に変換
* 必要に応じて構文木をトランスフォーマーで変換
* そして最後に構文木をコンパイラーで文字列に出力

という流れです。
![unifiedの処理の流れ](./unified-process.png)


### ライブラリ群
unifiedを支える構文解析ライブラリは3つです。
それぞれ構文定義の方法が統一されていて、構文定義、パーサー、コンパイラーが用意されています。
* [remark](https://github.com/remarkjs/remark) ･･･ マークダウン解析用
  * [mdast](https://github.com/syntax-tree/mdast) ･･･ 構文定義
  * [remark-parse](https://github.com/remarkjs/remark/tree/master/packages/remark-parse) ･･･ パーサー
  * [remark-stringify](https://github.com/remarkjs/remark/tree/master/packages/remark-stringify) ･･･ コンパイラー
* [rehype](https://github.com/rehypejs/rehype) ･･･ HTML解析用
  * [hast](https://github.com/syntax-tree/hast) ･･･ 構文定義
  * [rehype-parse](https://github.com/rehypejs/rehype/tree/master/packages/rehype-parse) ･･･ パーサー
  * [rehype-stringify](https://github.com/rehypejs/rehype/tree/master/packages/rehype-stringify) ･･･ コンパイラー
* [retext](https://github.com/retextjs/retext) ･･･ テキスト解析用
  * [nlcst](https://github.com/syntax-tree/nlcst) ･･･ 構文定義


ライブラリごとにプラグインが山ほどあって、例えばHMTLをミニファイしたり、マークダウンをリントしたり、文章中の`a`と`an`を識別したり、いろんなことができます。
プラグインがなくても汎用的はAPIで自分でロジックを組むことができ拡張性が高いのもポイントでしょう。

### 使い方
unifiedがパイプラインになっていて必要なライブラリを順番に設定します。
パーサーとコンパイラーは1つずつ、トランスフォーマーは任意の数指定してください。
パーサーとコンパイラーを指定しない場合、実行時にエラーになるので気をつけましょう。



```javascript:title=実装例
var unified = require('unified')
var markdown = require('remark-parse')
var remark2rehype = require('remark-rehype')
var doc = require('rehype-document')
var format = require('rehype-format')
var html = require('rehype-stringify')
var report = require('vfile-reporter')

unified()
  .use(markdown)      // パーサー（マークダウン文字列を構文木に変換）
  .use(remark2rehype) // トランスフォーマー（マークダウンからHTMLに変換）
  .use(doc)           // トランスフォーマー（HTMLタグなどでラップ）
  .use(format)        // トランスフォーマー（HTMLをフォーマット）
  .use(html)          // コンパイラー（rehypeの構文木を文字列に変換）
  .process('# Hello world!', function(err, file) {
    console.error(report(err || file))
    console.log(String(file))
  })
```

```text:title=実行結果
no issues found
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <h1>Hello world!</h1>
  </body>
</html>
```

### unified採用の経緯
このブログ(Gatsby製)は[gatsby-trasform-remark](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark)といプラグインでマークダウン情報を取得しています。ただ目次情報についてはHTML化した目次しか取得できません。
今回のような込み入った目次作成には少々難ありです。
悩んでいたところ[gatsby-trasform-remarkのソース](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-transformer-remark/src/extend-node-type.js#L20)を見てみたらマークダウン文字列解析にunifiedを使っていることに気づきました。
幸いgatsby-trasform-remarkで生のマークダウン文字列を取得できたので、unidiedで目次情報を抽出してQiitaっぽい目次ができそうだと考え採用しました。



## 実装
ポイントを載せていきます。詳細は[ソースコード](https://github.com/Takumon/react-markdown-sync-toc)を見てください。

### マークダウンをHMTL化する

マークダウン文字列を読み込んでHTML文字列に変換します。
スクロールごとに表示中の章を判定したいので[remark-slug](https://github.com/remarkjs/remark-slug)を使って章にidをつけています。

```javascript
import unified from 'unified'
import markdown from 'remark-parse'       // パーサー(文字列をremarkの構文木に変換)
import slug from 'remark-slug'            // トランスフォーマー(章にidをつける)
import remark2rehype from 'remark-rehype' // トランスフォーマー(マークダウンからHTMLに変換)
import html from 'rehype-stringify'       // コンパイラー(HTML構文木を文字列に変換)

const rawMarkdownBody = `## なにこれ
ReactでMarkdownファイルを読み込んで表示するアプリ。\n
目次も表示します。特徴としては目次においてスクロールに応じて現在表示中のセクションがハイライトされます。

## 大セクション その1`
･
･
･
`;

const { contents } =
  unified()
    .use(markdown)        // パーサー(文字列をremarkの構文木に変換)
    .use(slug)            // トランスフォーマー(章にidをつける)
    .use(remark2rehype)   // トランスフォーマー(マークダウンからHTMLに変換)
    .use(html)            // コンパイラー(HTML構文木を文字列に変換)
    .processSync(rawMarkdownBody)
```

<br>


```text:title=変換の流れ
マークダウン文字列
│
│ ←　remark-parse(パーサー)
↓
mdast構文木
│
│ ←　remark-slug(トランスフォーマー)
↓
章にidをつけたmdast構文木
│
│ ← remark-rehype(トランスフォーマー)
↓
hast構文木
│
│ ← rehype-stringify(コンパイラー)
↓
HTML文字列
```

### マークダウンから目次情報を抽出する

構文木取得後に独自ロジックで目次情報を抽出しています。
[unist-util-visit](https://github.com/syntax-tree/unist-util-visit)を使うと構文木を再帰的に捜査できるので、それを使って目次情報を抽出していきます。<br>
id採番はマークダウン本文のidを採番したときの[remark-slug](https://github.com/remarkjs/remark-slug)と同じロジック（[mdast-util-to-string](https://github.com/syntax-tree/mdast-util-to-string)と[github-slugger](https://github.com/Flet/github-slugger)を使った採番方法）を使います。<br>


```javascript{13-22}
import remark from 'remark'
import visit from 'unist-util-visit'
import mdastToString from 'mdast-util-to-string';
import GithubSlugger from 'github-slugger';
const githubSlugger = new GithubSlugger()

// マークダウン文字列から目次情報を抽出する
function _extractToc(rawMarkdownBody) {
  githubSlugger.reset();

  const result = []
  const ast = remark().parse(rawMarkdownBody);
  visit(ast, 'heading', child => {
    const value = child.children[0].value
    const id = githubSlugger.slug(value || mdastToString(child))
    const depth = child.depth
    result.push({
      value,
      id,
      depth
    })
  })

  return result
}
```


この後、抽出した目次情報をさらに加工します詳細は[ソースコード](https://github.com/Takumon/react-markdown-sync-toc/blob/master/src/scroll-sync-toc.js#L87-L169)をご覧ください。

### スクロール毎に表示中の章を判定する
Reactのコンポーネントで実装します。
スクロールイベントは`componentDidMount`で購読を開始し`componentWillUnmount`で破棄します。<br>
**スクロール処理は高負荷なので、[Lodashのthrottle](https://lodash.com/docs/4.17.10#throttle)を使って100ミリ秒ごとに間引いています。**
現在表示中の章の情報はsetStateでstateに格納しています。これにより章が切り替わった時に自動でReactが再描画してくれます。


```javascript{20,23-26,28-30,38-58}
import React from 'react';
import { throttle } from 'lodash';
import Toc from './toc';

const githubSlugger = new GithubSlugger()


class ScrollSyncToc extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.toc = _getToc(this.props.rawMarkdownBody)

    this.state = {
      activeItemIds: [],
      itemTopOffsets: [],
    };

    this.calculateItemTopOffsets = this.calculateItemTopOffsets.bind(this);
    this.handleScroll = throttle(this.handleScroll.bind(this), 100) // 負荷軽減のため間引く
  }

  componentDidMount() {
    this.calculateItemTopOffsets();
    window.addEventListener(`scroll`, this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener(`scroll`, this.handleScroll);
  }

  calculateItemTopOffsets() {
    this.setState({
      itemTopOffsets: _getElementTopOffsetsById(this.toc),
    });
  }

  handleScroll() {
    const { itemTopOffsets } = this.state;

    const item = itemTopOffsets.find((current, i) => {
      const next = itemTopOffsets[i + 1]

      return next
        ? window.scrollY >= current.offsetTop &&
            window.scrollY < next.offsetTop
        : window.scrollY >= current.offsetTop;
    })

    const activeItemIds =
      item
        ? item.parents
          ? [item.id, ...item.parents.map(i => i.id)]
          : [item.id]
        : [];

    this.setState({activeItemIds});
  }

  render() {
    const { activeItemIds } = this.state;
    return <Toc activeItemIds={activeItemIds} toc={this.toc} {...this.props} />;
  }
}

```

<br>

実際の目次コンポーネントは、現在表示中の章と目次情報を受け取って<br>
表示中の章は`active`クラスをつけて描画します。


```javascript
import React from 'react'
import { HashLink as Link } from 'react-router-hash-link';

class Toc extends React.Component {
  render() {
    const { toc, activeItemIds } = this.props;
    const items = toc.map(item => {
      return (
        <li style={{
          textAlign: 'left',
          marginLeft: `${(item.depth - 2) * 24}px`,
          listStyle: 'none'
          }}>
          <Link
            key={item.id}
            to={`#${item.id}`}
            className={activeItemIds.includes(item.id) ? 'active' : ''}>{item.value}</Link>
        </li>
      )
    })

    return (
      <ul style={{padding: '12px', background: '#eee'}}>
        {items}
      </ul>
    );
  }
}

export default Toc;
```


## まとめ
unifiedを使えば解析ツールなども簡単に実装できそうなので踏み込んで調べてみたいです。

