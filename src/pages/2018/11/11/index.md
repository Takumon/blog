---
title: GatsbyでQiitaから記事を取得する(gatsby-source-qiita)
date: '2018-11-11T21:00:00.000+09:00'
tags:
  - Gatsby
  - GatsbyPlugin
  - Qiita
---

## なにこれ
GatsbyにQiitaの記事を取り込めるプラグイン([gatsby-source-qiita](https://www.gatsbyjs.org/packages/gatsby-source-qiita/))を作って、自分のブログに適用しました。
QiitaからGatsbyに乗り換えようと考えている方で、Qiitaの記事を引き継ぎたいという方にも使っていただけるプラグインです。サンプル([gatsby-starter-qiita](https://takumon.github.io/gatsby-starter-qiita/))も用意してます。


![デモイメージ（コメント付き）](./gatsby-starter-qiita-with-comment.png)


## 概要
* プラグイン作成の経緯
* [gatsby-source-qiita](https://www.gatsbyjs.org/packages/gatsby-source-qiita/)
* [gatsby-starter-qiita](https://takumon.github.io/gatsby-starter-qiita/)
* gatsby-source-qiitaの実装ポイント
  * 目次情報作成
  * gatsby/graphql not found
  * プラグイン公開手順
* gatsby-starter-qiitaの実装ポイント
  * シンタックスハイライトのスタイル
  * オリジナル記事とQiita記事のスキーマ統一
  * Github-rebbons便利
* まとめ



## プラグイン作成の経緯とか
Qiitaとブログ、別々に管理するより、ブログで一元管理できたほうが良い思ったのと、
1つぐらい公式サイトで公開してみたいという思いから作りました。
大枠は[mottox2](https://github.com/mottox2)さんの[gatsby-source-esa](https://www.gatsbyjs.org/packages/gatsby-source-esa/)を参考にして、
[gatsby-transform-remark](https://www.gatsbyjs.org/packages/gatsby-transformer-remark)
、[Qiita APIドキュメント](https://qiita.com/api/v2/docs)を見ながら実装してます。



余談ですが、最近のQiitaはポエムや変な記事が乱立していて、変な方向に向かっていますね。
かつては有用な技術記事が多く見つかるのがQiitaイメージだったんですが、トレンド機能を導入してからでしょうか？　昔に戻ってもらえるとうれしいです。来月のQiita Advent Calendarに期待です！！<br>
とはいえ、良記事もたくさんあって、`Angualr`とかで絞ると結構見つかります。
最近、これは！と思った記事は、[Angularで、Angular Materialのテーマに対応するライブラリを作る](https://qiita.com/shibukawa/items/6eeaace2a130a0213386)です。こういうのこそQiitaにあるべき記事だと思います。

## gatsby-source-qiita

*参考: [gatsby-source-qiita | GitHub](https://github.com/Takumon/gatsby-source-qiita)*

まずは使う人目線で説明します。
インストールします。
```
npm install --save gatsby-source-qiita
```
<br>


そしてアクセストークやユーザ名を設定します。

```javascript:title=gatsby-config.jsの一部
module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-qiita`,
      options: {
        accessToken: `YOUR_PERSONAL_ACCESS_TOKEN`,
        userName: `YOUR_UAWE_NAME`,
        fetchPrivate: false,
        excludedPostIds: ['da8347f81a9f021b637f']
      }
    }
  ]
}
```


* accessToken
  * 【必須】API認証用のQiitaアクセストークンです。`Qiitaの設定ページ >  アプリケーション > 新しくトークンを発行する`で発行してください。
* userName
  * 【必須】Qiitaアカウント名です。ここで指定したアカウントに紐付く記事を引っ張ってきます。
* fetchPrivate
  * 【任意】限定公開記事も引っ張ってくるか設定します。デフォルトはfaleです。
* excludedPostIds
  * 【任意】除外したい記事をid配列で指定します。デフォルトは空配列です。


<br>

これで、Qiitaの記事をGraphQLで取得できるようになります。
ほぼQiita APIのまんまですが、目次情報(headings)が欲しかったので追加しています。



```json{7-16}:title=Qiita記事取得用のクエリ
{
  allQiitaPost {
    edges {
      node {
        id
        title
        headings {
          value
          id
          depth
          parents {
            value
            id
            depth
          }
        }
        rendered_body
        body
        comments_count
        created_at
        likes_count
        reactions_count
        tags {
          name
        }
        updated_at
        url
        user {
          id
        }
      }
    }
  }
}
```






## gatsby-starter-qiita
*参考: [gatsby-starter-qiita | GitHub](https://www.gatsbyjs.org/docs/create-source-plugin/)*

[gatsby-starter-blog](https://github.com/gatsbyjs/gatsby-starter-blog)をベースにgatsby-source-qiitaを導入、オリジナルの記事とQiitaの記事を一緒くたに一覧表示するスターターです。
[デモ](https://takumon.github.io/gatsby-starter-qiita/)もあります。


![デモイメージ（コメント付き）](./gatsby-starter-qiita-with-comment.png)






## gatsby-source-qiitaの実装のポイント

### 目次情報作成
過去記事の[unifiedでMarkdownをHTMLに変換 & ReactでQiitaっぽい目次を作る](../../10/28)
と同様にマークダウンから抽出して、セクションリンク付与でいけるかなと思ったら、<br>
QiitaAPIで取得するHTMLは既にリンクが埋め込まれていました。そのためMarkdownからではなくHTMLから目次を抽出しています。remarkではなくrehypeを使いました。


```javascript:title=HTMLから目次情報抽出する処理
function _extractHeadingDetails(htmlStr) {
  const htmlAst = rehype.parse(htmlStr)

  const result = []
  visit(htmlAst, HEADER_TYPE_IN_HAST, node => {
    if (!HEADER_TAG_NAMES_IN_HAST.includes(node.tagName)) {
      return
    }

    const heading = {
      depth: Number(node.tagName[1]),
      // In case of html from Qiita. Header has prefix of "\n"
      value: hastToString(node).replace('\n', '')
    }
    node.children.filter(c => _isHeaderIdLink(c)).forEach(c => {
      heading.id = decodeURI(c.properties.href.split('#')[1])
    });

    result.push(heading)
  })

  return result
}

function _isHeaderIdLink(node) {
  return node.tagName === 'a'
          && node.properties.href
          && node.properties.href.startsWith('#')
}
```


### プラグインをローカルインストールするとgatsby/graphql not found
プラグインではgatsby/graphqlを使う場合、プラグイン自体の依存ライブラリには追加しません。
ビルド時にアプリケーションのgatsby/graphqlを使ってプラグインも含め全体をコントロールするためです。<br>

のはずなんですが、`npm install ../gatsby-source-qiita`のようにプラグインをnpmでローカルインストールするとビルド時に
「gatsby/graphql not found」と怒られました。
これは動作確認時だけアプリのplugins配下においてローカルプラグインとして扱うことで回避しました。
npm公開したやつだと問題なく動いたのですが...最後まで謎でした。


### プラグイン公開手順
いきなしnpmパッケージで開発を始めるよりは、下記手順で開発するほうが、段階を経て動作確認できるので楽でした。

1. (Gatsby APIを使わない処理について)コンポーネントで実装
2. アプリケーション自体の`gatsby-node.js`や`gatsby-browser.js`で実装
3. ローカルプラグインに切り出して`gatsby-node.js`や`gatsby-browser.js`で実装
4. 別プロジェクトに切り出してnpmパッケージとして実装、　アプリケーション側からは`npm install ../gatsby-source-qiita`のようにローカルnpmインストール
5. npm公開
6. アプリケーション側で`npm install gatsby-source-qiita`のようにnpmインストール




## gatsby-starter-qiitaの実装ポイント

### シンタックスハイライトのスタイル
Qiita APIで取得するHMTLのソースコードブロックは、Qiitaで想定してるクラスが付与されています。
そのため、シンタックスハイライトのスタイルはQiitaから流用しました。Qiitaのサイトで開発者ツールで該当のCSS開いてコピペです。Qiitaの記事を表示する時だけグローバルインストールするようにしました。


### オリジナルとQiitaの記事のスキーマを統一したい
プラグインを使う側で、オリジナル記事とQiitaの記事でスキーマが違うため、一緒くたに扱いづらかったので、
[スキーマ統一用ローカルプラグイン](https://github.com/Takumon/blog/tree/master/plugins/gatsby-remark-and-qiita/gatsby-node.js)を用意しました。(プラグイン名はテキトーですが...)<br>
プラグインでは[createNodeField](https://www.gatsbyjs.org/docs/actions/#createNodeField)というAPIでノードのfieldsに自由にプロパティが追加できます。
そのため[onCreateNode](https://www.gatsbyjs.org/docs/node-apis/#onCreateNode)(ノード生成時に呼ばれるAPI)でfieldsにタイトルや作成日など共通プロパティを追加してお互いのスキーマの差異を吸収しています。


```javascript{8-30,32-37}
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type !== `MarkdownRemark` && node.internal.type !== `QiitaPost`) {
    return
  }

  // ここで差異を吸収
  const [
    slug,
    title,
    date,
    excerpt,
    tags,
  ] =
    node.internal.type === `MarkdownRemark`
      ? [
        createFilePath({ node, getNode }),
        node.frontmatter.title,
        node.frontmatter.date,
        _excerptMarkdown(node.rawMarkdownBody, 120),
        node.frontmatter.tags
      ]
      :[
        `/${node.id}/`,
        node.title,
        node.created_at,
        _excerptHtml(node.rendered_body, 120),
        [...(node.tags.map(tag => tag.name) || []), 'Qiita'] // Qiitaタグを追加
      ]

  // ノードのfieldsにプロパティを追加
  createNodeField({ name: `slug`,     node,   value: slug     })
  createNodeField({ name: `title`,    node,   value: title    })
  createNodeField({ name: `date`,     node,   value: date     })
  createNodeField({ name: `excerpt`,  node,   value: excerpt  })
  createNodeField({ name: `tags`,     node,   value: tags     })
}
```



### Github-ribbons便利
GitHub Pagesなどでサンプル公開したときに、ソースコードのリンクを付けたくなりますが、
その時に便利なのが[Github-ribbons](https://blog.github.com/2008-12-19-github-ribbons/)です。
いろんなところで見かけるこのリボン、実はコピペで簡単に実装できたんですね。知らなかった。

![GitHub Ribbons](./github-ribbons.png)


```html:title=Github-rebbonsのコードを少しReactベースに修正して貼り付けました
<a href="https://github.com/Takumon/gatsby-starter-qiita">
  <img
    style={{
      position: 'absolute',
      top: 0,
      right: 0,
      border: 0
    }}
    src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_png"
    alt="Fork me on GitHub" />
</a>
```




## まとめ
今回はQiitaから記事を取得するGatsbyプラグインを作りました。
自分のプラグインが[Gatsbyのサイト](https://www.gatsbyjs.org/packages/gatsby-source-qiita/)に載ったときは、ちょっと感動しました。まぁ審査とか無しで誰でもできるんですけどね...<br>




