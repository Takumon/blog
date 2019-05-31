---
title: 'GatsbyのルートページにContextを設定する方法'
date: '2019-05-31T17:00:00.000+09:00'
tags:
  - Gatsby
keywords:
  - Gatsby
slug: /how-to-attach-context-to-root-page-in-gatsby
thumbnail: thumbnail/2019/05/how-to-attach-context-to-root-page-in-gatsby.png
---

## なにこれ

Gatsbyでページを作成する場合、gatsby-node.jsのcreatePagesで以下のようにしますが、ルートページ（index.jsのページ）はGatsby側で生成されるので通常はContextが設定できません。しかし場合によってはルートページにContextを設定したい時もあるでしょう。そこで今回は、ルートページにContextを設定する方法をご紹介します。

```js{7-12}:title=gatsby-node.jsでページにContextを設定する方法
exports.createPages = ({ actions }) => {
  /* (中略) */

  actions.createPage({
    path: node.fields.slug,
    component: qiitaPost,
    context: {
      slug: node.fields.slug,
      relatedPosts,
      latestPosts,
      ...previouseAndNext(posts, index)
    },
  })

  /* (中略) */
}
```

## 実装方法

gatsby-node.jsでは[`onCreatePage`](https://www.gatsbyjs.org/docs/node-apis/#onCreatePage)というAPIが用意されており、ページ生成時の処理を定義できます。これを使って以下のような処理を実行します。

やり方は原始的で、ルートページ生成されたときに、
いったん削除して、自分でルートページを再生成します。
この時`createPage`のオプションでContextを渡せば、Contextを追加できます。

```js{4-7,9-10,15-18}:title=gatsby-node.js
exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions

  // ルートページの場合のみ処理継続
  if (page.path === '/') {
    return;
  }

  // いったんルートページを削除
  deletePage(page)

  // pageオブジェクトをもとにページ再生成
  createPage({
    ...page,
    context: {
      ...page.context,
      house: `Gryffindor`,
    },
  })
}
```


## 参考
* [Creating and Modifying Pages | GatsbyJS](https://www.gatsbyjs.org/docs/creating-and-modifying-pages/#pass-context-to-pages)


以上です🍅
