---
title: Gatsbyプラグインの使い方･作り方･公開方法
date: "2018-10-20T21:00:00.000Z"
tags:
  - Gatsby
  - GatsbyPlugin
keywords:
  - GatsbyPlugin
slug: /2018/10/20/
thumbnail: thumbnail/2018/gatsby-plugin.png
---

## なにこれ
Gatsby公式サイトの[プラグイン](https://www.gatsbyjs.org/docs/plugins/)の章のまとめ。


## プラグイン概要
Gatsbyプラグインは、Gatsbyの全処理を拡張および修正可能です。
例えば下記のようなことができます。

* 外部コンテンツ（CMS、ファイル、REST APIなど）を追加してGraphQLで扱えるようにする
* ファイル（Markdown、YAML、CSVなど）データをJSON形式にフォーマットする
* サードパーティーの機能（Google Analytics, Instagram）をGatsbyで作ったWebサイトに追加する

またnpmパッケージでモジュール化されているため、巨大で複雑なWebサイトでも簡潔に機能追加･管理が可能です。

### 公開プラグインを検索する
プラグイン一覧と個別仕様は [GatsbyのPlugins](https://www.gatsbyjs.org/plugins/)で確認できます。
[公式プラグイン](https://github.com/gatsbyjs/gatsby/tree/master/packages)とコミュニティ提供のものをあわせると、なんと502個もあるようです。（2018/10/20現在）


## プラグインの使い方

プラグインはnpmパッケージで公開されています。
まずはnpmインストールしましょう。

<small>下記はgatsby-transformer-jsonの例</small>

```
npm install --save gatsby-transformer-json
```

<br>

次に`gatsby-config.js`の`plugins`配列に追加してください。

```javascript:title=gatsby-config.jsの一部
module.exports = {
  plugins: [`gatsby-transformer-json`],
}
```

<br>

オプションも指定できます。
下記のように`gatsby-config.js`を書き換えましょう。

```javascript:title=gatsby-config.jsの一部
module.exports = {
  plugins: [
    // オプションなしで指定する場合は下記のようにプラグイン名を文字列で指定しましょう。
    "gatsby-plugin-react-helmet",
    // オプションありの場合は、オブジェクトで指定します。
    {
      resolve: `gatsby-source-filesystem`,
      // オプションはさらにオブジェクトで指定します。
      options: {
        path: `${__dirname}/src/data/`,
        name: "data",
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        // プラグイン自体を拡張するプラグインを指定できます。
        // その場合はオプションのpluginsにプラグインを定義しましょう。
        plugins: [`gatsby-remark-smartypants`],
      },
    },
    {
      resolve: "gatsby-plugin-offline",
      // 下記のように空オプションの場合は、プラグイン名を文字列で指定した場合と同じです。
      options: {
        plugins: [],
      },
    },
  ],
}
```


### ローカルのプラグインを使う場合
自作プラグインなどは、npm公開せずとも`plugins`フォルダに配置すると使えます。

```javascript:title=gatsby-config.jsの一部
module.exports = {
  plugins: [`gatsby-local-plugin`],
}
```

<br>

他フォルダに起きたいならフォルダパスを指定しましょう。

```javascript{3-5}:title=gatsby-config.jsの一部
module.exports = {
  plugins: [
    {
      resolve: require.resolve(`/path/to/gatsby-local-plugin`),
    },
  ],
}
```






## プラグインの作り方
* npmパッケージ、ローカルプラグインどちらの形式もOKです。
* `package.json`と`gatsby-config.js`が必要です。
* Gatsby API([Node](https://www.gatsbyjs.org/docs/node-apis/)、[サーバーサイドレンダリング](https://www.gatsbyjs.org/docs/ssr-apis/)、[ブラウザ](https://www.gatsbyjs.org/docs/browser-apis/)の3種類)を必要に応じて実装しましょう。

### 作成するファイル
<small>※[必須]と記載がないものについては任意です。</small>

* **package.json** --- [必須]ローカルプラグインの場合は空オブジェクトでも可。
  * **name**  GraphQLのデータ構造におけるプラグインの識別子です。未指定の時はプラグインのフォルダ名になります。
  * **version**  キャッシュ管理用です。これが変わるとキャッシュがクリアされます。未指定の時は、gatsby- *ファイルの内容のMD5ハッシュになります。ローカルプラグインを開発中の場合は、不用意なキャッシュを避けるため指定しないほうが良いでしょう。
  * **keywords**  検索用に指定してください。ここで`gatsby`と`gatsby-plugin`の2つを指定してnpm公開すると、[Plugins | Gatsby](https://www.gatsbyjs.org/plugins/)のリストに追加できます。
* 以下3ファイルはプラグインが拡張･修正したい機能に応じて作成してください。
  * **gatsby-browser.js** -- [ブラウザAPI](https://www.gatsbyjs.org/docs/browser-apis/)の実装を定義します。
  * **gatsby-node.js** -- [ノードAPI](https://www.gatsbyjs.org/docs/node-apis/)の実装を定義します。
  * **gatsby-ssr.js** -- [サーバーサイドレンダリングAPI](https://www.gatsbyjs.org/docs/ssr-apis/)の実装を定義します。

### 命名規約
タイプごとに推奨する命名規約があります。

* `gatsby-source-*` ---  外部コンテンツ（WordPress、MongoDB、ファイル）からデータをロードするタイプの場合
  * 例： [gatsby-source-contentful](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-source-contentful)
  * 参考： [ソースプラグインを生成する](https://www.gatsbyjs.org/docs/create-source-plugin/)
* `gatsby-transformer-*` --- データをJSON形式に変換するタイプの場合
  * 例：　[gatsby-transformer-yaml](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-yaml)
* `gatsby-[plugin-name]-*` --- 特定のプラグインを拡張する場合
  * 例：　[gatsby-remark-images](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-images)　※[gatsby-transformer-remark](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark)を拡張するプラグイン
* `gatsby-plugin-*` --- 上記以外の場合
  * 例：　[gatsby-plugin-sharp](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-sharp)


### ローカルプラグイン
`plugins`配下にプラグイン名のフォルダを作ります。

```
plugins
└── my-own-plugin
    └── package.json
```

この状態ではプラグイン用の`gatsby-config.js`を定義していないので、プロジェクトはプラグインを自動認識できません。<br>

プロジェクトの`gatsby-config.js`にプラグイン名（フォルダ名）を指定しましょう。

```javascript:title=gatsby-config.jsの一部
module.exports = {
  plugins: [
    'my-own-plugin',
  ]
}
```

なおプラグインのソースコードはBabelでトランスコンパイルされないので注意してください。
新しいJavaScript文法を使いたい場合はプラグインフォルダ配下に`src`フォルダを作って配下にコード格納し、Babelでビルドした資産をプラグインフォルダ配下に出力するなどの工夫が必要です。

### どういう場合にプラグインを作るか
なんでもかんでもプラグイン化するわけではありません。<br>
JavaScriptやReact.jsの機能（ライブラリ）を追加する場合などはプラグインを作らなくてよいのです。以下に例を示します。

* 一般的な機能を提供するJavaScriptパッケージ（[lodash](https://github.com/lodash/lodash)や[axios](https://github.com/axios/axios)など）を使う場合
* React.jsのUIライブラリ（[Ant Design](https://ant.design/)や[Material UI](https://material-ui.com/)など）を使う場合
* 統合可視化ライブラリ（[Highcharts](https://www.highcharts.com/)や[D3.js](https://d3js.org/)など）を使う場合

プラグインはGatsby APIをパッケージ化して最低限の設定で済むようにするのが目的です。
例えば`Styled Components`を使う場合、自分でGatsby APIを使ってサーバーサイドレンダリング対応を組み込めますが、
この対応はプラグイン化すべきです。実際これは`Gatsby-plugin-styled-components`というプラグインがあります。


### Source PluginとTransformer Plugin
主要なプラグインのタイプの2つにSource PluginとTransformer Pluginがあり両者は連携して機能します。
例えばマークダウンファイルの場合、
Source Pluginの[gatsby-source-filesystem](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/)がファイルからFileノードを供給し、Transformer Pluginの[gatsby-transformer-remark](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark)がFileノードをMarkdownRemarkノードに変換します。<br>

なおFileノードはファイルの生の内容と**メディアタイプ**を含みます。
メディアタイプは必須項目ではありませんが、Source Pluginで生成したノードが生データ(Transformer Plugin未処理のデータ)であることを示す手段です。
メディアタイプでSource PluginとTransformer Pluginの橋渡しを行い、データ読み込みと加工を分離することで、各プラグインを小さく保つことができるのです。


### Source Pluginの作り方
npmパッケージとして作成します。`package.json`と`gatsby-node.js`を作りましょう。
`gatsby-node.js`は下記のような感じです。


```javascript:title=gatsby-config.jsの一部
exports.sourceNodes = async ({ actions }) => {
  const { createNode } = actions
  // データを生成（ここではデータを外部から取得する例を示す）
  const data = await fetch(REMOTE_API)

  // データからノードを生成
  data.forEach(datum => createNode(processDatum(datum)))

  // 生成したノードをリターン
  return
}
```

*NOTE:* Gatby APIの実装詳細は、[sourceNodes](https://www.gatsbyjs.org/docs/node-apis/#sourceNodes)、[createNode](https://www.gatsbyjs.org/docs/actions/#createNode)を参照してください。
ここでは例示していませんが、[gatsby-node-helpers](https://github.com/angeloashmore/gatsby-node-helpers)を使うとAPIの実装が簡単になるので記述量が大きくなるようなら、使ってみることをお勧めします。


#### ノード間参照を定義する
プラグインが出力するノートにおいて、ノード間の参照を定義することでより複雑な構造を定義します。
これらの実現方法は2つあります。

**(1) Transformation relationships**<br>
`gatsby-transformer-remark`では、Fileノードが親、MarkdownRemarkノードが子という関係を定義し、
親ノードのマークダウン文字列、子ノードでHTMLに変換しています。
これらの関係は`createParentChildLink`を使って定義します。具体的な実装方法については[gatsby-transformer-remark](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-transformer-remark/src/on-node-create.js#L65)を参照してください。<br>
なお子ノードは親ノードからの派生なので、親ノードが削除時は全ての子ノードが削除されます。


**(2) Foreign-key relationships**<br>
別々のオブジェクト(型定義も全く別々)を紐付ける方法です。
この場合Transformation relationshipsと異なり、片方のオブジェクトが削除されても関係するオブジェクトは削除されません。



### Transformer Plugin
通常のNPMパッケージとして作成します。`package.json`と`gatsby-node.js`を作りましょう。

#### 変換後ノードの型定義
`gatsby-node.js`で変換後ノードの型定義をsetFieldsOnGraphQLNodeTypeに指定します。

```javascript:title=gatsby-config.jsの一部
exports.setFieldsOnGraphQLNodeType = require(`./extend-node-type`)
```

*NOTE:* setFieldsOnGraphQLNodeTypeの詳細は[APIリファレンス](https://www.gatsbyjs.org/docs/node-apis/#setFieldsOnGraphQLNodeType)参照


#### キャッシュの取り扱い
変換処理はコストがかかるため、ビルドするたびに作り直さずにすむようにGatsbyのグローバルキャッシュ機能を使います。
キャッシュキーには少なくとも関連リソースのcontentDigestが必要です。
たとえば、gatsby-transformer-remarkは、HTMLノードに下記のようにキャッシュキーを指定しています。

```javascript:title=extend-node-type.js
const htmlCacheKey = node =>
  `transformer-remark-markdown-html-${
    node.internal.contentDigest
  }-${pluginsCacheStr}-${pathPrefixCacheStr}`
```

<br>

キャッシュへのアクセスは下記のようにします。

```javascript:title=extend-node-type.js
const cachedHTML = await cache.get(htmlCacheKey(markdownNode))

cache.set(htmlCacheKey(markdownNode), html)
```




## プラグインの公開方法
プラグインのpackage.jsonのkeywordに`gatsby`と`gatsby-plugin`をつけてnpm公開すれば、
最大12時間後にライブラリ一覧のインデックスにいったん追加されます。
その後[公式サイト](https://gatsbyjs.org)のデイリービルドが走ると、ようやくプラグインが一覧に追加され、
[GatsbyのPlugins](https://www.gatsbyjs.org/plugins/)で見れるようになります。

*NOTE:* せっかく公開するなら検索しやすいように`gatsby`と`gatsby-plugin`以外にもキーワードを指定しましょう。例えばMarkdown MathJax transformerは下記のように指定しています。


```json
"keywords": [
  "gatsby",
  "gatsby-plugin",
  "gatsby-transformer-plugin",
  "mathjax",
  "markdown",
]
```

## まとめ
Gatsbyはプラグイン機構が非常に考えぬかれたスマートな形をしていますね。<br>
機能追加時もnpmインストールして`gatsby-config.js`に設定を追加するだけなのでコードがとてもスッキリするなぁという印象でした。<br>
プラグイン公開時も、npmパッケージでkeywordに`gatsby`と`gatsby-plugin`をつけるだけというシンプルさも見逃せません。<br>
なお今回[Source Plugin Tutorial](https://www.gatsbyjs.org/docs/source-plugin-tutorial/)のページは見ていませんが、
自作プラグインを公開する時はこのページを参考にしたいと思います🍅