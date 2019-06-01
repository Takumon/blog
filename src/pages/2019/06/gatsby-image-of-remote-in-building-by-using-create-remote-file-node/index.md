---
title: 'Gatsbyでビルド時に取得した画像に対してgatsby-imageを適用する方法'
date: '2019-06-1T12:00:00.000-07:00'
tags:
  - Gatsby
  - gatsby-image
keywords:
  - Gatsby
slug: /gatsby-image-of-remote-in-building-by-using-create-remote-file-node
thumbnail: thumbnail/2019/06/how-to-attach-context-to-root-page-in-gatsby.png
---

## なにこれ

Gatsbyで画像を扱う場合[gatsby-image](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-image)を使うとイイ感じに最適化してくれます。
Webサイトのリポジトリ内の画像については`gatsby-config.js`で簡単に設定できますが、**今回はビルド時に動的に取得する外部画像に対して設定する方法をご紹介します。**

## 実装方法

Gatsbyの[gatsby-source-filesystem]()では、外部画像を扱うためのAPI(`createRemoteFileNode`)が用意されています。
コチラを`gatsby-node.js`の`sourceNodes`で呼び出してノードを生成すればOKです。
あと、ちょっとしたハックとして、Reactコンポーネント側で他ファイルノードと区別できるように、ノード生成時に識別子を付けましょう。
これは後述する外部画像表示用コンポーネントで使うためのものです。


```javascript:title=gatsby-node.js
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

// sourceNodesにて外部画像のファイルノードを作成する
exports.sourceNodes = async ({ actions, createNodeId, cache, store }) => {
  /* (中略) */

  // ここでは外部画像のURLの配列を処理するサンプルを示す
  await Promise.all(someImageUrls.map(async imageUrl => {

    // createRemoteFileNodeで外部の画像のファイルノードを作成する
    const fileNode = await createRemoteFileNode({
      url: imageUrl,
      cache,
      store,
      createNode: actions.createNode,
      createNodeId: createNodeId,
    });

    // 他ファイルノードと区別するための識別子を付与
    await actions.createNodeField({
      node: fileNode,
      name: 'AuthorImage',
      value: 'true',
    });

    // メタ情報として画像のURLを付与
    await actions.createNodeField({
      node: fileNode,
      name: 'link',
      value: imageUrl,
    });

    return fileNode;
  }));

  /* (中略) */
}
```
<br/>


ビルドで外部画像をファイルノードとして取り込めたら、
今度はReactのコンポーネント側で、それを`gatsby-iamge`として扱うコンポーネントを実装します。
ビルド時に付与した識別子を使い、すべてのファイルノードから外部画像のノードだけをGraphQLで抽出するようにしましょう。
こうすることでGraphQL実行時に全ファイルノードを読み込むコストを省きます。
GatsbyではGraphQLはビルド時に実行されますが、これをやらないとビルドに相当時間がかかるります。



```jsx:title=ogp-image.jsx
import React from 'react';
import GatsbyImage from 'gatsby-image';
import { StaticQuery, graphql } from 'gatsby';

// OGP画像のURLを引数に取る
export default ({ url }) => (
  <StaticQuery
    query={graphql`
      query {
        allFile(
          # Gatsby Buildで付与した識別子をもとに
          # 全ファイルからOPG画像のみ抽出
          filter: {fields: {OgpImage: {eq: "true"}}}
        ){
          edges {
            node {
              childImageSharp {
                resolutions {
                  ...GatsbyImageSharpResolutions
                }
              }
              id
              fields {
                # 一応メタ情報も取得する
                OgpImage
                link
              }
            }
          }
        }
      }
    `}
    render={data => {
      // OGP画像リストの中から、コンポーネント引数で指定したURLの画像を抽出する
      const targetEdge = data.allFile.edges.find(edge => edge.node.fields.link === url);

      // 画像が取得できた場合のみGatsby-imageのコンポーネントを返す
      return (
        targetEdge && targetEdge.node.childImageSharp
          && <GatsbyImage resolutions={targetEdge.node.childImageSharp.resolutions} />
          : null
      );
    }}
  />
);
```
<br/>


最後に上記コンポーネントの呼び出します。以下のようにOGP画像のURLを指定してあげましょう。

```jsx
  <OgpImage url={ogpImageUrl} />
```
<br/>

これで外部画像を`gatsby-image`イイ感じに最適化して表示できます！


## 例：WEBサイトURLからOGP画像を取得する場合

実用的な例として、複数のWebサイトのOGP画像を`gatsby-image`として扱う方法をご紹介します。


```javascript:title=gatsby-node.js
const axios = require('axios');
const cheerio = require('cheerio');
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

// sourceNodesにて外部画像のファイルノードを作成する
exports.sourceNodes = async ({ actions, createNodeId, cache, store }) => {
  /* (中略) */


  // WEBサイトURLからHTMLを取得してOGPを抽出
  const ogpImageUrls = [];
  // Promise.allで処理するとリクエスト多可で503になるのでfor文で一件ずつ処理する
  for (const postUrl of postUrls) {
    
    const res = await axios.get(postUrl.link, {
      headers: {'User-Agent': 'something different'},
    })

    // cheerioを使ってHMTLからOGP画像URLを抽出
    let ogpImageUrl;
    const $ = cheerio.load(res.data)
    $('head meta').each((i, el) => {
      const property = $(el).attr('property')
      const content = $(el).attr('content')
      if (property === 'og:image') {
        ogpImageUrls.push(ogpImageUrl);
      }
    });
  }

  // 取得したOGP画像URLをもとにファイルノードを生成
  await Promise.all(ogpImageUrls.map(async imageUrl => {
    const fileNode = await createRemoteFileNode({
      url: imageUrl,
      cache,
      store,
      createNode: actions.createNode,
      createNodeId: createNodeId,
    });

    // 他ファイルノードと区別するための識別子を付与
    await actions.createNodeField({
      node: fileNode,
      name: 'OgpImage',
      value: 'true',
    });

    // メタ情報として画像のURLを付与
    await actions.createNodeField({
      node: fileNode,
      name: 'link',
      value: imageUrl,
    });

    return fileNode;
  }));
```
<br/>

Reactのコンポーネントの定義、呼び出し側定義は[実装方法](#実装方法)で紹介した内容とほぼ同じなので割愛します。


## まとめ

今回の方法を使えば、外部から画像をかき集めてリッチなWebサイトを構築する場合でも、Gatsby側で画面表示を最適化してくれて、画面表示が遅くなる心配もありません。
是非参考にしてみてください🍅


## 参考

* [Wrangling remote images with Gatsby](https://www.wildsmithstudio.com/blog/remote-images-with-gatsby/)
* [graphql - Gatsby - fetching remote images with createRemoteFileNode - Stack Overflow](https://stackoverflow.com/questions/52612936/gatsby-fetching-remote-images-with-createremotefilenode)

