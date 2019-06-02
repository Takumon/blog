---
title: 'Gatsbyで2種類のマークダウンファイルの区別する方法'
date: '2019-06-01T21:00:00.000-07:00'
tags:
  - Gatsby
keywords:
  - Gatsby
slug: /how-to-distinct-2-kinds-of-markdown-in-gatsby
thumbnail: thumbnail/2019/06/how-to-distinct-2-kinds-of-markdown-in-gatsby.png
---

## なにこれ

GatsbyでWebサイトを作るときに、ブログや職種紹介など2種類以上のマークダウンファイルを管理する場合があると思います。通常だとMarkdownRemarkNodeの`fileAbsolutePath`でしか両者のマークダウンファイルを見分ける術がありませんが、ここではもっとスマートなやり方を紹介します。簡単に言うとFileNodeの`sourceInstanceName`をMarkdownRemarkNodeに引き継ぐことにより、GraphQLのfilterで簡単に区別できるという方法です。

## 実装方法

### Step1. マークダウンファイルのFleNodeでsourceInstanceNameを定義

マークダウンファイルの読み込み設定はgatsby-config.jsで以下のようにします。
`name`を付けることでマークダウンファイルのFileNodeにおいて`sourceInstanceName`が設定できます。

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


### Step2. FileNodeのnameをMarkdownFileNodeに引継ぐ

何もしないとFileNodeの`sourceInstanceName`はMarkdownRemarkNodeに引き継がれません。
そのため`gatsby-node.js`で引継ぎ処理を実装します。

```js:title=gatsby-node.js
exports.onCreateNode  = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators

  // MarkdownRemarkNodeの場合のみ処処
  if (node && node.internal && node.internal.type === 'MarkdownRemark') {

    // 親のFileNodeを取得して
    const parent = getNode(node.parent)

    // gatsby-config.jsで設定したFileNodeのsourceInstanceNameを
    // MarkdownRemarkのフィールドに引き継ぐ
    // 名前はMarkdownRemarkの他プロパティとかぶらないようにcollectionとしている
    createNodeField({
      node,
      name: 'collection',
      value: parent.sourceInstanceName,
    })
  }
};
```
<br/>

### Step3. GraphQLでnameをもとにマークダウンを区別

GraphQLではcollectionフィールドで、それぞれを区別します。

```graphql{3-4}
query {
  allMarkdownRemark(
    # collectionにて記事のNodeのみ抽出
    filter: { fields: { collection : { eq: "posts" } } }
  ) {
    edges {
      node {
        # (中略)
      }
    }
  }
}
```
<br/>


## まとめ

簡単ですがGatsbyで良く困る事例の1つを紹介しました。
Gatsbyは多くのフックポイントを設けているので、今回のよう、やろうと思えば結構いろんなことができます🍅

## 参考

* [Question: How do I query based on gatsby-source-filesystem name? · Issue #1634 · gatsbyjs/gatsby](https://github.com/gatsbyjs/gatsby/issues/1634)

