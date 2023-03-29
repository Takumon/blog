---
title: Gatsby2系の新機能
date: "2018-10-12T12:00:00.000Z"
tags:
  - Gatsby
keywords:
  - Gatsby
slug: /2018/10/12/
thumbnail: thumbnail/2018/gatsby-v2.png
---

## なにこれ
[Gatsby](https://www.gatsbyjs.org/)（React製の静的サイトジェネレーター）が2018年9月に2系にアップデートしたそうです。
2系の新機能について、公式ブログ([Announcing Gatsby 2.0.0](https://www.gatsbyjs.org/blog/2018-09-17-gatsby-v2/))を参考に、主要な部分をピックアップして紹介します。


## Gatsby採用事例
Gatsbyは、多くのデベロッパーが、ブログ、アプリ、マーケッティングサイト、ECサイト、ドキュメントなどを作る際に採用しています。<br>
例をあげると、

* Reactの[公式ドキュメントとブログ](https://reactjs.org/)
* Nikeの[Just Do It](https://justdoit.nike.com/)
* Airbnbの[公式サイト](https://airbnb.io/)

などなど。
他にもまだまだあるそうで、それらは[Shwcase | Gatsby](https://www.gatsbyjs.org/showcase/)で確認できます。

## Gatsbyの動向
1系をリリースしてから直近1年で、かなり大きなエコシステムに成長しています。

* コントリビューターが198人から1100人に
* 90プルリク/週ほどをマージ中（1年前は50ほど）
* 400万ダウンロード達成
* 457個のプラグインがnpmで公開されている
* 55万人がGastbyのWebサイトを訪れている
* GitHubのスター数が10kから22.5kに
* コントリビューターが[会社を設立](https://www.gatsbyjs.org/blog/2018-05-24-launching-new-gatsby-company/)。OSSサポートのため370万ドルを調達し、GatsbyでWebサイトを構築・公開するのを支援するクラウドツールを公開

## Gatsby2系の新機能・改善点

### 1. ビルドの高速化
ビルド時間が75%に短縮されています。
* [開発環境時のページレンダリングにおけるメモリ使用量削減](https://github.com/gatsbyjs/gatsby/pull/4912#issuecomment-381407967)
* webpack 4系アップデートによりJavaScriptとCSSのバンドルの速度向上
* React 16系アップデートによりサーバーサイドレンダリングのパフォーマンスが3〜4倍に向上
* 低速アルゴリズムを数多くリファクタリング（[参考プルリク](https://github.com/gatsbyjs/gatsby/pull/6226)）
* サーバーサイドレンダリングをマルチプロセス化（[参考プルリク](https://github.com/gatsbyjs/gatsby/pull/6417)）

### 2. クライアント側のJavaScriptランタイムを31%削減
Gatsby製Webサイトに必ず含まれるJavaScriptのランタイムを31%削減（78.5kbから53.9kb）しています。
これはGatsbyが依存しているライブラリの改善が要因としては大きく、その中でも下記2つは大きな削減ポイントです。
* React16へのバージョンアップによるファイルサイズ30%削減（49.8kbから34.8kb）
* ルーター機能 react-routerから@reach/router移行ともなうルータ部分ファイルサイズ70%削減（18.4kbから6kb）

### 3. React 16
15から16へアップデートしています。
16ではReactエコシステムが大きく変更されていて、例えば、<br>

* Fragment
* Error Boundary
* Portals機能の追加
* カスタムDOM属性のサポート
* サーバーサイドレンダリングの改善
* フィアルファイルサイズ削減

などです。詳細はReact公式サイトのブログ [React v16.0 Released](https://reactjs.org/blog/2017/09/26/react-v16.0.html)を参照してください。


### 4. Webpack 4
3から4へのアップデートに伴い下記改善がされています。
* ビルド時間の短縮　　※詳細：[webpack 4 release blog post](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4)
* 新しいコード分割アルゴリズム　　※詳細：[Code Splitting optimizations](https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366)
* CSS遅延ロードの第一級サポート　　※詳細：[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)


### 5. Babel 7
6から7へのアップデートに伴い下記改善がされています。
* [ビルド時間短縮](https://babeljs.io/blog/2018/08/27/7.0.0#speed)
* [自動ポリフィルの実験的サポート](https://babeljs.io/blog/2018/08/27/7.0.0#automatic-polyfilling-experimental)
* 対応シンタックスの拡大(TypeScriptとJSXなど)

詳細はBabel公式サイトのブログ [Babel 7 Released](https://babeljs.io/blog/2018/08/27/7.0.0)を参照してください。


### 6. @reach/router導入によるアクセシビリティ改善
ルーター機能を[react-router](https://reacttraining.com/react-router/core/guides/philosophy)から[@reach/router](https://reach.tech/router)に切り替えています。
それによってスクリーンリーダーに対応しアクセシビリティが向上しています。
ちなみに@reach/routerの作者はreact-routerと同じ`Ryan Florence`なので、自分のGatsby製のWebサイトを2系に移行するときも手間なく簡単です。


### 7. GraphQL stitching
GraphQL stitchingを実験的にサポートしています。
GraphQL APIとGraphQLステッチングを提供するサービスがますます増えているなかで、
Gatsbyではソースプラグインでラップすることなく直接APIを使用できます。

* [RFC](https://github.com/gatsbyjs/rfcs/blob/master/text/0000-native-graphql-source.md)
* [gatsby-source-graphql](https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-source-graphql/README.md)

### 8. Ludicrous Mode（爆速ホットリローディング）
ホットリローディングが爆速になっています。
そのためマークダウン編集がほぼリアルタイムでブラウザに反映されるようになっています。

<blockquote class="twitter-tweet" data-lang="ja"><p lang="en" dir="ltr">Coming soon to Gatsby v2: Ludicrous mode data hot reloading ;-)<a href="https://t.co/by1PyOYXc0">https://t.co/by1PyOYXc0</a><br><br>(note, this gif is not sped up at all) <a href="https://t.co/hFIYMbpalN">pic.twitter.com/hFIYMbpalN</a></p>&mdash; Gatsby (@gatsbyjs) <a href="https://twitter.com/gatsbyjs/status/974507205121617920?ref_src=twsrc%5Etfw">2018年3月16日</a></blockquote>

### 9. Layoutの廃止
Gatsby1系のLayout機能は便利な反面、Reactのコンポーネント構成の規則を破るもので混乱を招く要因だったので2系では廃止されています。
ただ廃止はされていますが、プラグイン[gatsby-plugin-layout](https://www.gatsbyjs.org/packages/gatsby-plugin-layout/)
を使うことで2系でもLayout機能を使うことが可能です。

* [RFC](https://github.com/gatsbyjs/rfcs/blob/master/text/0002-remove-special-layout-components.md)
* [1系から2系への移行方法](https://www.gatsbyjs.org/docs/migrating-from-v1-to-v2/#remove-or-refactor-layout-components)
* [Jason Lengstorfの記事](https://www.gatsbyjs.org/blog/2018-06-08-life-after-layouts/)


### 10. StaticQueryタグ
「コンポーネントでデータを取得するにはどうすればいいの？」
という質問が非常に多かったらしく、任意のコンポーネントでデータをGraphQLで取得できるStaticQueryというタグが追加されています。

* [RFC](https://github.com/gatsbyjs/rfcs/blob/master/text/0002-remove-special-layout-components.md#detailed-design)
* [Gatsbyドキュメント](https://www.gatsbyjs.org/docs/static-query/)

### 11. gatsby-plugin-offline改善
多くのバグフィックスと機能拡張が施されたようです。

### 12. トレース機能
どのプラグインやパーツのビルドに時間がかかっているかを可視化する機能が追加されており、ビルドのボトルネックをデバッグする際にとても便利です。

* [Gatsbyドキュメント](https://www.gatsbyjs.org/docs/performance-tracing/)



## まとめ
記事を読んでみて、Gatsby2系はビルド速度が向上して開発環境周りのサポートが充実したなぁという印象です。<br>
特にLudicrous Mode（爆速ホットリローディング）は、実際に試してみて感動しました。
ほんとにマークダウンの編集がリアルタイムにブラウザに反映されるので、今後ますますGatsbyでのWebサイト構築が簡単になるのではないでしょうか。<br>
ちなみに、[store.gatsbyjs.org](https://store.gatsbyjs.org/)でステッカー、Tシャツ、靴下を販売しているそうです。コレ結構ほしい。

