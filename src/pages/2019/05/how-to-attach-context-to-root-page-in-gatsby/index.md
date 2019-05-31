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


以上です🍅
