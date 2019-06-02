---
title: 'Gatsbyで2種類のマークダウンファイルの区別する方法'
date: '2019-06-1T21:00:00.000-07:00'
tags:
  - Gatsby
keywords:
  - Gatsby
slug: /how-to-distinc-2-kinds-of-markdown-in-gatsby
thumbnail: thumbnail/2019/06/how-to-distinc-2-kinds-of-markdown-in-gatsby.png
---

## なにこれ

GatsbyでWebサイトを作るときに、ブログ記事や職種紹介など2種類のマークダウンファイルを管理する場合があると思います。通常だとMarkdownRemarkのabsoluteFilePathでしか両者のマークダウンファイルを見分ける術がありませんが、ここではもっとスマートなやり方を紹介します。簡単に言うとFileNodeのsourceInstanceNameをMarkdownRemarkに引き継ぐことによりGraphQLのfilterで区別するという方法です。

## 実装方法

### それぞれのMarkdownでFileNodeのnameを定義

マークダウンファイルの読み込み設定はgatsby-config.jsで以下のようにします。
`name`を付けることでFileNodeの`sourceInstanceName`が設定できます。

```js{10-11,18-19}:title=gatsby-config.js
module.exports = {
  /* (中略) */

  plugins: [
    /* (中略) */

    {
      resolve: 'gatsby-source-filesystem',
      options: {
        // オプションでname(FileNodeにおけるsourceInstanceName)を指定
        name: 'posts',
        path: `${__dirname}/content/posts`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        // オプションでname(FileNodeにおけるsourceInstanceName)を指定
        name: 'jobs',
        path: `${__dirname}/content/jobs`,
      },
    },
    'gatsby-transformer-remark',

    /* (中略) */
  ],

  /* (中略) */
};
```
<br/>


### FileNodeのnameをMarkdownFileNodeに引継ぐ

何もしないとFileNodeの`sourceInstanceName`はMarkdownRemarkに引き継がれません。
そのため以下のようにして引継ぎ処理を実装します。

```js:title=gatsby-config.js
exports.onCreateNode  = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators

  // FileNodeを親にMarkdownRemarkノードが生成された場合
  if (node && node.internal && node.internal.type === 'MarkdownRemark') {

    // 親のFileNodeを取得して
    const parent = getNode(node.parent)

    // gatsby-config.jsで設定したFileNodeのsourceInstanceNameを
    // MarkdownRemarkのフィールドとして定義
    // 名前はMarkdownRemarkの他プロパティとかぶらないようにCollectionとしている
    createNodeField({
      node,
      name: 'collection',
      value: parent.sourceInstanceName,
    })
  }
};
```
<br/>

### GraphQLでnameをもとにマークダウンを区別する

上記引継ぎ処理をすれば`name`をMarkdownFileNodeのプロパティとして扱えます。
GraphQLでは以下のようにそれぞれを区別できるようになります。

```graphql
query {
  allMarkdownRemark(
    # collectionにて記事のNodeのみ抽出
    filter: { fields: { collection : { eq: "posts" } } }
  ) {
    edges {
      node {
        # 中略
      }
    }
  }
}
```
<br/>


## まとめ

簡単ですがGatsbyで良く困る事例の1つを紹介しました。
Gatsbyは多くのフックポイントを設けているので、今回のように無理やりやろうと思えば結構いろんなことができますね🍅

## 参考



