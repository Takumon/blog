---
title: 'パスを渡せばgatsby-imageで画像を表示してくれるコンポーネントの作成方法'
date: '2019-05-13T19:00:00.000+09:00'
tags:
  - Gatsby
  - gatsy-image
keywords:
  - Gatsby
slug: /simple-gatsby-image-wrapper
thumbnail: thumbnail/2019/05/simple-gatsby-image-wrapper.png
---

## なにこれ

こんな感じで[gatsby-image](https://www.gatsbyjs.org/packages/gatsby-image/)の画像を表示したい。そんなコンポーネントの作成方法です。

```jsx
  const filename = 'filepath/to/myimage.png'
  return <Image filename={filename} />
```
<br/>

gatsby-imageをちょっと知っている人ならわかると思うのですが、gatsby-imageで画像を表示するには、いちいちStaticQueryタグとGraphQLのクエリを定義する必要があって結構面倒です。そして[公式ドキュメント](https://www.gatsbyjs.org/packages/gatsby-image/)には画像のファイルパスをGraphQLのクエリにハードコードする方法しか載っておらず、**Reactコンポーネントで画像ファイルパスを変数として扱う方法**については記載がありません。
**そこで今回は、画像ファイルパスを渡せばgatsby-imageで画像を最適化して表示してくれるコンポーネントを作りました。**

きっかけは、最近[自分のブログの記事一覧](../)のデザインを変えて、サムネイル画像を表示するようにしました。今までは体感速度がそれほど遅くないし、gatsby-imageは使い方が面倒くさそうだったので避けていました。たださすがに、50個以上のサムネイル画像を表示するようになると明らかに遅くなったので、gatsby-imageの導入を決めました。

実際のソースコードは以下です。手っ取り早く実装方法を見たい方はコチラをご覧ください。

https://github.com/Takumon/blog/blob/master/src/components/image/index.js


## 実装

### うまくいかない例

[公式ドキュメント > How to use](https://www.gatsbyjs.org/packages/gatsby-image/#how-to-use)ではGraphQLのクエリに画像ファイルパスをハードコードする方法が紹介されています。
コレを参考にして、画像ファイルパスを変数として扱うには以下のようにすれば良さそうな気がします。

```jsx:title=うまくいかない例
import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'


// 画像ファイルパスをプロパティに取るようなコンポーネントを定義
export default ({ filename }) => (

  // ページじゃないコンポーネントでもGraphQLが使えるように
  // StaticQueryタグを使う
  <StaticQuery

    // GraphQLのクエリ引数にfilenameを指定！
    query={graphql`
      query {
        file(relativePath: { eq: "${filename}" }) {
          childImageSharp {
            fixed(width: 800) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    `}

    render={(data) => {
      // GraphQLでgatsby-image用の情報がdataに代入されているはず！
      const fixed = data.file.childImageSharp.fixed

      // Imgタグでgatsby-imageで最適化された画像を表示する
      return <Img fixed={fixed} />
    }
  />
)
```
<br/>


ただこれはうまく行きません。
StaticQueryタグは文字通り「静的」であり、ビルド時に評価されるので、画面表示時に「動的」に変数を指定することはできないのです。またStaticQueryのクエリはテンプレートリテラルとして文字列補完をサポートしておらず、その結果ビルド時に以下のようなエラーになってしまいます。

```txt
Error: BabelPluginRemoveGraphQL: String interpolations are not allowed in graphql fragments.
Included fragments should be referenced as ...
```
<br/>

### うまくいく例

前述のうまくいかない例では、GraphQLのクエリで画像ファイルを特定しようとしていました。
今回はコレを**GraphQLのクエリですべての画像を取得して、描画時に画像ファイルを特定する**ようにします。

```jsx:title=うまくいく例
import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

// 画像ファイルパスをプロパティに取るようなコンポーネントを定義
export default ({ filename }) => (

  // ページじゃないコンポーネントでもGraphQLが使えるように
  // StaticQueryタグを使う
  <StaticQuery

    // GraphQLのクエリ引数には何も指定しない！
    query={graphql`
      query {
        images: allFile {
          edges {
            node {
              relativePath
              name
              childImageSharp {
                sizes(maxWidth: 800) {
                  ...GatsbyImageSharpSizes
                }
              }
            }
          }
        }
      }
    `}

    // 全画像情報がdataに代入されている
    render={(data) => {

      // 指定した画像ファイルパス（コンポーネントのプロパティ）と
      // 一致するgatsby-image用の情報を取得
      const image = data.images.edges.find(n => {
        return n.node.relativePath.includes(filename)
      })

      if (!image) return
      
      // Imgタグでgatsby-imageで最適化された画像を表示する
      const imageSizes = image.node.childImageSharp.sizes
      return <Img　sizes={imageSizes} />
    }}
  />
)
```
<br/>

これによってめんどくさい処理をコンポーネントに隠蔽できました。使う側は以下のように定義します。

```jsx:title=コンポーネントの使用イメージ
import Image from '上記で作成したコンポーネントのパス'

export default ({ filename }) => {
  const filename = 'filepath/to/myimage.png'
  return <Image filename={filename} />
})
```
<br/>


## まとめ

今回はgatsby-imageを楽に使えるコンポーネントの作成方法を紹介しました。GraphQLのクエリですべての画像を取得するので、ビルドがちょっと遅くなります（実際のブラウザの表示には影響はありません）。それでも画像のファイルパスを変数として扱うことができるようになるし、実装が簡潔になるので、利便性は高いと言えるでしょう🍅


## 参考

実装は以下を参考にさせていただきました。ありがとうございます。

* [Easy Gatsby Image Components](https://noahgilmore.com/blog/easy-gatsby-image-components/)
* [Gatsby.jsの画像最適化プラグインgatsby-imageを触ってみてわかったこと。 - Qiita](https://qiita.com/tkkrr/items/34f384956fb968a30fe5)
* [Support Dynamic GraphQL Queries · Issue #2293 · gatsbyjs/gatsby](https://github.com/gatsbyjs/gatsby/issues/2293)
