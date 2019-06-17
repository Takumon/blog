---
title: 'Gatsby + Netlify + ZapierでRSSリーダーを作る'
date: '2019-06-17T09:30:00.000-07:00'
tags:
  - Gatsby
  - Netlify
  - Zapier
  - RSS
  - gatsby-plugin-feed
keywords:
  - Gatsby
slug: /gatsby-rss-reader-with-netlify-and-zapier
thumbnail: thumbnail/2019/06/gatsby-rss-reader-with-netlify-zapier.png
---

## なにこれ

自分専用のRSSリーダーを[Gatsby](https://gatsbyjs.org) + [Netlify](https://netlify.com) + [Zapier](https://zapier.com/)で作りました。ビルド時に各サイトからRSSとOGPを取得して、Webサイトに表示しています。

<div class="iframely-embed"><div class="iframely-responsive" style="padding-bottom: 52.4699%; padding-top: 120px;"><a href="https://favorite-blogs.netlify.com//" data-iframely-url="//cdn.iframe.ly/hDjUcmi"></a></div></div>

<br/>
ソースはコチラ

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://github.com/Takumon/blog-rss" data-iframely-url="//cdn.iframe.ly/B8twzEh"></a></div></div>

<br/>

今回はこのWebサイトのビルドの仕組みと、GatsbyビルドでRSS+OGPを取得する方法をご紹介します。

## ビルドの仕組み

// TODO 絵

### 1. NetlifyでGitHubリポジトリをビルド＆ホストできるようにする
NetlifyとRSSリーダーのGitHubリポジトリを連携していつでもNetlifyでRSSリーダーをビルド＆ホストできるようにしておきます。連携はNelityの画面上で、ポチポチ簡単にできます。

### 2. RSSが更新されたらビルドをトリガーできるようにする

ビルド＆ホスティングの準備はできましたが、RSSリーダーは「RSSが更新されたらビルドをトリガーする」ような仕組みが必要です。この仕組みはNetlifyとZapierで実現できます。
Zapierはいろんなサービスやアプリを連携させて自動化できるWebサービスで、Netlifyにも対応しています。
Zapierの画面上で、監視したいRSSをポチポチ登録すると「RSSが更新されたらNetlifyのビルドをトリガーする」が簡単に実現できます。

## RSS + OGP取得

さてビルドの仕組みを整えてRSSが更新時Gatsbyのビルドが走るようにできたので、次はGatsbyのビルドでRSSを取得する方法について説明します。

どのRSSを引っ張ってくるかは、リポジトリに[設定ファイル](https://github.com/Takumon/blog-rss/blob/master/favorite-blog-rss.js)として持たせます。コレ、NetlifyのRSS情報と二重管理になってしまうのが難点ですが致し方なしといったところです。Zapierのタスクがyamlで書けるようになったら一元管理できるかもなーと思ってます。

RSSだけだとそっけないサイトなっちゃうので、RSSで取得した記事のURLを元にOGP画像を取得しています。

// TODO 実装解説


### リソース取得は間隔を置かないと503になる

ビルド時にRSSやらOGPやらを引っ張ってくるために、大量のリクエストを発行しますが、サイトによっては時間当たりのリクエスト上限に引っかかって503エラーになることがあります。
対処法としては、`Promise.all`で一度にリクエストを投げずに、for文でリクエスト1つずつawaitしながら投げて、適度に間隔を開けるのが良いと思います。

// TODO 実装解説


## まとめ

RSSリーダーのようなものをSPAだけで作ろうとすると、フロント側の高負荷処理で画面描画が遅くなってしまいますが、
Gatsbyを使えばビルド時に重い処理を流せるので、パフォーマンスの向上が期待できます。
また今回のように、NetlifyやZapierなど他サービスと連携することで、作れる静的サイトの幅も広がります。
SPA(Single Page Application)でこのような静的サイトを作っている方は一度Gatsbyを導入してみてはいかがでしょうか🍅
