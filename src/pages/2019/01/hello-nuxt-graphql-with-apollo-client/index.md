---
title: Nuxt.js＋Apollo＋GraphQLをサクッと学べた /「Hello, GraphQL for client-side!」を読んだ
date: '2019-01-07T19:00:00.000+09:00'
tags:
  - GraphQL
  - Nuxt.js
  - Apollo Client
  - Vue.js
  - 読書感想
keywords:
  - GraphQL
slug: /hello-nuxt-graphql-with-apollo-client
thumbnail: thumbnail/2019/01/hello-nuxt-graphql-with-apollo-client.png
---

## なにこれ

Nuxt.js＋GraphQLの知識がこれから必要になるので**[「Hello, GraphQL for client-side!」](https://booth.pm/ja/items/1045830)**を読んだところ、非常にサクっと学ぶことができたので感想を書きます。
GraphQLでサーバーと通信するには**[「Apollo Client」](https://www.apollographql.com/client)**というライブラリを使用します。
Nuxt.jsではApollo Clientを使いやすくしたライブラリである
**[「apollo-module」](https://github.com/nuxt-community/apollo-module)**が用意されており、本書は主に**「apollo-moduleの設定方法・実装方法についてチュートリアル形式で学べる一冊」**になっていました。ボリュームも46ページとそんなに多くないので、**「1日～2日で読める」**内容です。
ただNuxt.jsの説明は端折っていたり、VuexのStoreのdispatchも知っている前提なので**「Nuxt.js触ったことある人向け」**かなと感じました。


<div class="iframely-embed"><div class="iframely-responsive" style="height: 168px; padding-bottom: 0;"><a href="https://booth.pm/ja/items/1045830" data-iframely-url="//cdn.iframe.ly/api/iframe?url=https%3A%2F%2Fbooth.pm%2Fja%2Fitems%2F1045830&key=0658bf78be97cafcf2b0b9f96c1270ee"></a></div></div>

<br/>

## 目次

第1章は冒頭6ページまでで、第2章がメインです。

* <第1章> GraphQLとは？
    * 1.1. 概要
    * 1.2. Apollo Client
* <第2章> GraphQL with Nuxt.js
    * 2.1. 概要
    * 2.2. Nuxt.js
    * 2.3. apollo-module
    * 2.4. クエリの書き方
    * 2.5. 取得（Queries）
    * 2.6. 更新（Mutation）
    * 2.7. エラーハンドリングについて
    * 2.8. オフライン対応について
    * 2.9. テスト
    * 2.10. 良い使い方
    * 2.11. 周辺ライブラリ・エコシステム
    * 2.12. まとめ

## 本の感想


### 公式ドキュメントや他サイトを多く紹介してくれている:blush:

文章中にNuxt.js+GraphQLを学んでいくうえで参考になるサイトを多く紹介してくれています。
そのため**「読了後も紹介先を見ながら理解を深めていける」**のが良い点です。
本書に紹介されているものと、それに付随して自分で調べたものを以下にまとめました。

* [Apollo ClientのAPIリファレンス](https://www.apollographql.com/docs/react/api/apollo-client.html#apollo-client)
* [apollo-devtools](https://github.com/apollographql/apollo-client-devtools)
  * [Chromeの拡張機能](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm)です。開発者ツールでアプリのGraphQLサーバーに対してクエリの送信・取得ができます。
* [GitHub GraphQL API explorer](https://developer.github.com/v4/explorer/)
    * GitHubが提供しているGraphQLのAPIを叩けるオンラインエディターです。
    * とりあえずGraphQLを試したいならココがオススメです。
* [GraphiQL](https://github.com/graphql/graphiql)
    * ブラウザ上でGraphQLのIEDを実現するライブラリです。GraphQLを調べているとよく出てきます。
    * 機能がシンプル過ぎて、HTTPヘッダーを追加できない（つまり認証情報が乗せられない）などのデメリットがあります。
* [Altair](https://github.com/imolorhe/altair)
    * GraphiQLよりリッチなGraphQLのIEDです。Chrome拡張機能、Electronアプリ、Webサイトなどのさまざまな形式で提供されています。
    * HTTPヘッダー情報などを追加できるので認証が必要なAPIも叩けます。


### テストについてもチュートリアルがあるのは助かる:blush:

実際の開発だとテストコードは必須なので、プロダクションコードだけでなくGraphQLのモックを使ったテストが紹介されていて非常にありがたいです。


### サンプルコードを見ながら読み進めたほうが良い:warning:

本書ではチュートリアル形式でサンプルアプリを作っていきますが、記載しているソースコードのファイルパスは書かれていないことが多いので、そこらへんは[サンプルコード](https://github.com/takanorip/nuxt-graphql-sample)が理解の助けになります。あと必要なライブラリのyarn addも「明示してないけど適宜やってね」という感じでした。

### GitHubのトークンはハードコードしないほうが良いのでは？:warning:

GitHubのアクセストークンをソースコードにハードコードするよりは、[@nuxtjs/dotenv](https://github.com/nuxt-community/dotenv-module)を使う方法を載せておいたほうが親切かなと思いました。実際[サンプルコード](https://github.com/takanorip/nuxt-graphql-sample)は@nuxtjs/dotenvを使っていますし。


### 誤植？

<small>自分の認識ミスかもしれませんが...</small>

* （P9）`apollo-moduleとapollo-link-httpをインストールします。`の直後のコマンドが`yarn add @nuxtjs/apollo`になっています。正しくは`yarn add @nuxtjs/apollo apollo-link-http`です。
* （32P）型「URI」は「String」です。GraphQLにURIという型はないし、32Pの型定義にもURIの定義はないので、おそらく「String」かと思います。
* （33P）reposMockのviewer.repositories.nodesは配列なので[]で囲む必要があります。
* （33P）addMockFunctionsToSchemaにセットするオブジェクトのプロパティは`mock`ではなく`mocks`です。
* （39P）「予期せぬネラー」は「予期せぬエラー」です。

## まとめ

Nuxt.js＋GraphQLをまだ始めたばかりですが、**[「Hello, GraphQL for client-side!」](https://booth.pm/ja/items/1045830)**は最初のとっかかりとしてオススメの一冊でした。これでapollo-moduleの設定・実装・テストの必要最低限を把握できたので、次のステップとしては、以下を参考に、サンプルアプリを作ったりAppoloのキャッシュまわりの設計について取り組むのが良いかなぁと考えています。<br/>


<div class="iframely-embed"><div class="iframely-responsive" style="padding-bottom: 70.7035%; padding-top: 120px;"><a href="https://www.aintek.xyz/posts/graphql-nuxt-chat" data-iframely-url="//cdn.iframe.ly/api/iframe?url=https%3A%2F%2Fwww.aintek.xyz%2Fposts%2Fgraphql-nuxt-chat&key=0658bf78be97cafcf2b0b9f96c1270ee&iframe=card-small"></a></div></div>

<br/>

<iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fblog.hiroppy.me%2Fentry%2Fapollo-link-state" style="border: 0; width: 100%; height: 190px;" allowfullscreen scrolling="no" allow="autoplay; encrypted-media"></iframe>

<iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Femployment.en-japan.com%2Fengineerhub%2Fentry%2F2018%2F12%2F26%2F103000" style="border: 0; width: 100%; height: 190px;" allowfullscreen scrolling="no" allow="autoplay; encrypted-media"></iframe>

<br/>

🍅