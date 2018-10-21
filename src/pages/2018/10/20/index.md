---
title: Gatsbyプラグインの使い方･作り方･公開方法
date: "2018-10-20T21:00:00.000Z"
tags:
  - Gatsby
  - GatsbyPlugin
---

## なにこれ
Gatsby公式サイトの[プラグイン](https://www.gatsbyjs.org/docs/plugins/)の章を読んでまとめたものです。


## プラグイン概要
Gatsbyの全ての処理をプラグインで修正および拡張できるようにしています。下記のようなことができます。

* CMS、ファイル、REST APIなどの外部データ・コンテンツを追加してGraphQLで扱えるようにする
* Markdown、YAML、CSVなどデータをJSON形式にフォーマットする
* Google Analytics, Instagramなどのサードパーティーの機能をGatsbyで作ったWebサイトに追加する

GatsbyプラグインはGatsby APIを実装したNode.jsのパッケージで、巨大で複雑なWebサイトになればなるほど、独自のプラグインを作ってモジュール化することを推奨します。

### 公開プラグインを検索する
どんなプラグインがあるか、プラグインがどんな仕様なのかは [Gatsbyプラグイン一覧](https://www.gatsbyjs.org/plugins/)で確認できます。
Gatsbyは公式プラグインの他にもコミュニティが提供するものがあり、2018/10/21現在で502個あります。


## プラグインの使い方
プラグインはnpmパッケージで公開されているので、まずはnpmインストールしましょう。
下記は`gatsby-transformer-json`を使う時の例です。

```
npm install --save gatsby-transformer-json
```

<br>

次に`gatsby-config.js`の`plugins`配列に追加します。

```javascript:title=gatsby-config.jsの一部
module.exports = {
  plugins: [`gatsby-transformer-json`],
}
```

<br>

プラグインはオプションをとることができます。
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
自作プラグインなどは、npmに公開していなくても`plugins`フォルダに配置すると使えます。

```javascript:title=gatsby-config.jsの一部
module.exports = {
  plugins: [`gatsby-local-plugin`],
}
```

<br>

もし他のフォルダに配置ならフォルダパスを指定します。

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
* npmパッケージ、ローカルプラグインどちらの形式も可能
* `package.json`必須
* Gatsby API([Node](https://www.gatsbyjs.org/docs/node-apis/)、[サーバーサイドレンダリング](https://www.gatsbyjs.org/docs/ssr-apis/)、[ブラウザ](https://www.gatsbyjs.org/docs/browser-apis/)の3種類)を必要に応じて実装

### プラグインの命名規約
タイプごとに推奨する命名規約があります。

* `gatsby-source-*` ---  WordPress、MongoDB、ファイルなどからデータをロードするタイプの場合
  * 例： [gatsby-source-contentful](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-source-contentful)
  * 参考： [ソースプラグインを生成する](https://www.gatsbyjs.org/docs/create-source-plugin/)


* `gatsby-transformer-*` --- データをJSON形式に変換するタイプの場合
  * 例：　[gatsby-transformer-yaml](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-yaml)


* `gatsby-[plugin-name]-*` --- 特定のプラグインを拡張する場合
  * 例：　[gatsby-remark-images](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-images)　※[gatsby-transformer-remark](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark)を拡張するプラグイン


* `gatsby-plugin-*` --- 上記いずれにも該当しない場合
  * 例：　[gatsby-plugin-sharp](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-sharp)

### プラグインに必要なファイル
<small>※[必須]と記載がないものについては任意です。</small>

* **package.json** --- [必須]ローカルプラグインの場合中身は空オブジェクト(`{}`)で良いです。
  * **name** はGraphQLのデータ構造におけるプラグインの識別子です。指定しない場合はプラグインのフォルダ名が使われます。
  * **version** はキャッシュ管理用です。これが変わるとキャッシュをクリアします。指定しない場合は、gatsby- *ファイルの内容のMD5ハッシュが使われます。ローカルプラグインの場合は省略することを推奨します。
  * **keywords** はプラグインが検索しやすくするために指定しあす。npmパッケージで公開する場合は`gatsby`と`gatsby-plugin`の2つをつけることで、[プラグイン一覧](https://www.gatsbyjs.org/plugins/)に追加されます。
* **gatsby-browser.js** -- [ブラウザAPI](https://www.gatsbyjs.org/docs/browser-apis/)の実装を定義します。
* **gatsby-node.js** -- [ノードAPI](https://www.gatsbyjs.org/docs/node-apis/)の実装を定義します。
* **gatsby-ssr.js** -- [サーバーサイドレンダリングAPI](https://www.gatsbyjs.org/docs/ssr-apis/)の実装を定義します。

### ローカルプラグイン
`plugins`フォルダに下記のように配置します。

```
plugins
└── my-own-plugin
    └── package.json
```

この時点では`gatsby-config.js`がないのでプラグインとしては認識されません。認識するためには`gatsby-config.js`にフォルダ名を定義しましょう。

```javascript:title=gatsby-config.jsの一部
module.exports = {
  plugins: [
    'my-own-plugin',
  ]
}
```

プラグインのソースコードはBabelでトランスコンパイルされません。
使用しているNode.jsでサポートされていないシンタックスを使う場合は`src`フォルダ配下にコードを配置してBabelでルートフォルダ配下にビルドが必要です。

### どういう場合にプラグインを作るか
JavaScriptやReact.jsの機能（ライブラリ）を追加する場合などはプラグインを作らなくてよいです。

* 一般的な機能を提供するJavaScriptパッケージ（[lodash](https://github.com/lodash/lodash)や[axios](https://github.com/axios/axios)など）を使う場合
* React.jsのUIライブラリ（[Ant Design](https://ant.design/)や[Material UI](https://material-ui.com/)など）を使う場合
* 統合可視化ライブラリ（[Highcharts](https://www.highcharts.com/)や[D3.js](https://d3js.org/)など）を使う場合

プラグインはGatsby APIをパッケージ化して最低限の設定で済むようにするのが目的です。
例えば`Styled Components`を使う場合、自分でサーバーサイドレンダリング対応をアプリに組み込むことはできますが、
`Gatsby-plugin-styled-components`を使えば設定で簡単に実現できます。


### Transformer PluginとSource Pluginの関係
例えば[gatsby-source-filesystem](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/)はファイルから`File`型のノード（ファイルシステムに関するデータ）を「供給」します。このFileノードはファイルの生の内容と**メディアタイプ**を含みます。
メディアタイプは必須項目ではありませんが、Source Pluginで生成したノードが生データ(Transformer Pluginにまだ処理されていないデータ)であることを示す手段です。
メディアタイプでSource PluginとTransformer Pluginの橋渡しを行い、データ読み込みと加工を分離することで、それぞれのプラグインを小さく保つことができます。



### Transformer Plugin


#### 変換後ノードの型定義
`gatsby-node.js`で変換後ノードの型定義をsetFieldsOnGraphQLNodeTypeに指定します。

```javascript:title=gatsby-config.jsの一部
exports.setFieldsOnGraphQLNodeType = require(`./extend-node-type`)
```

*NOTE:* setFieldsOnGraphQLNodeTypeの詳細は[APIリファレンス](https://www.gatsbyjs.org/docs/node-apis/#setFieldsOnGraphQLNodeType)参照


#### キャッシュの取り扱い
変換処理はコストがかかるため、ビルドするたびに作り直さずにすむようにGatsbyのグローバルキャッシュ機能を使います。
キャッシュキーには少なくとも関連リソースのcontentDigestが含まれる必要があります。
たとえば、gatsby-transformer-remarkは、HTMLノードに下記のようにキャッシュキーを指定します。

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

### Source Pluginの作り方
通常のNPMパッケージとして作成します。`package.json`と`gatsby-node.js`を作ります。
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

*NOTE:* これらのAPIの実装に関する詳細なドキュメントについては、[sourceNodes](https://www.gatsbyjs.org/docs/node-apis/#sourceNodes)および[createNode](https://www.gatsbyjs.org/docs/actions/#createNode)のドキュメントを参照してください。
またユーティリティで[gatsby-node-helpers](https://github.com/angeloashmore/gatsby-node-helpers)という便利なライブラリがあります。


#### ノード間参照を定義する
方法は2つあります。

**(1) Transformation relationships**<br>
`gatsby-transformer-remark`を例に説明すると、親のFileノードのマークダウン文字列をMarkdownRemarkノードに変換します。
`createParentChildLink`を使ってFileノードの子ノードにMarkdownRemarkノードを指定します。
例: [gatsby-transformer-remark](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-transformer-remark/src/on-node-create.js#L65)

Transformation relationshipsは、単一のノードから派生する新しいノードを定義する時に使われます。
全ての子ノードは親ノードからの派生なので、親ノードが削除または変更された場合は全ての子ノード(とまたその子ノード...)を削除します。


**(2) Foreign-key relationships**<br>
別々のオブジェクト(型定義も全く別々)を紐付ける方法です。
片方のオブジェクトが削除されても、関係するオブジェクトは削除されません。




## プラグインの公開方法
作ったプラグインのpackage.jsonのkeywordに`gatsby`と`gatsby-plugin`をつけてnpmに公開すれば、
最大12時間後にライブラリ一覧のインデックスに追加され、
その後[公式サイト](https://gatsbyjs.org)のデイリービルドが走れば、プラグインが一覧に追加されます。

*NOTE:* 検索しやすいように`gatsby`と`gatsby-plugin`以外にもキーワードを指定しましょう。例えばMarkdown MathJax transformerのキーワードは下記のようになっています。


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
Gatsbyはプラグイン機構がしっかりしており、<br>
機能を追加する時もnpmインストールして`gatsby-config.js`に設定を追加するだけなので
コードがとてもすっきりするなぁという印象でした。<br>
またプラグインを公開する時も、npmパッケージでkeywordに`gatsby`と`gatsby-plugin`をつけるだけというシンプルさも見逃せません。<br>
今回[Source Plugin Tutorial](https://www.gatsbyjs.org/docs/source-plugin-tutorial/)のページは見ていませんが、
自分でプラグインを作る時はこのページを見てみたいと思います。