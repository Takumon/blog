---
title: 'Gatsbyバージョンアップ（v2 to v5）'
date: '2023-04-06T09:00:00.000+09:00'
tags:
  - Gatsby
keywords:
  - Gatsby
slug: /migrate-gatsby-v2-to-v5
thumbnail: thumbnail/2023/04/migrate-gatsby-v2-to-v5.png
---

## なにこれ

ブログについて以下２点改修したので備忘録を残します。

- **Gatsbyをv2からv5に更新**：しばらくブログを更新しない間にGatsbyの最新バージョンはv2からv5になっていたのでバージョンアップしました。
- **＋αの機能を削除**：いままではプロフィールページなど充実させて機能をモリモリにしていましたが、今後はメンテコストを下げて記事投稿に集中したいからです。

## Gatsbyのバージョンアップ

忘れていたり古くなった私のGatsbyの知識をアップデートするため、
package.jsonのライブラリ更新ではなく、`npm init gatsby blog -- -y -ts`でアプリを新規作成して、必用な機能だけ移行する形を取りました。

ここではライブラリのバージョンアップだけではうまく行かない点について列挙します。

### gatsby-image, gatsby-background-image

画像を扱うライブラリが大きく変わっていました。
いずれも公式サイトに従って書き換えました。

- [gatsby-image移行方法 | Gatsby公式サイト](https://www.gatsbyjs.com/docs/reference/release-notes/image-migration-guide/)
- [gatsby-background-iamgeプラグインのREADME](https://www.gatsbyjs.com/plugins/gatsby-background-image/#gatsby-34--gatsby-plugin-image)

またgatsby-background-imageは[GitHubのissue](https://github.com/timhagn/gatsby-background-image/issues/179)で記載があるようにGatsby V5の場合はビルドエラーが出ます。やむをえず`npm ci`や`npm i`実行時は`--legacy-peer-deps`を付与しています。

### emotion

[Emotion11でパッケージ名が変わっている](https://emotion.sh/docs/emotion-11#package-renaming)のでインポート文を変えました。

```diff
- import { css } from '@emotion/core'
+ import { css } from '@emotion/react'
```

<br/>

またtsxファイルでcss属性に対してエラーが出るようになったので、[Emotionの公式サイト](https://emotion.sh/docs/eslint-plugin-react)を参考にeslintrc.jsのruleに以下追加しました。

```diff:title=eslintrc.js
{
  "rules": {
+    "react/no-unknown-property": ["error", { "ignore": ["css"] }]
  }
}
```

## 削除した機能

改修過程で記事投稿に関係のないプロフィールのような付加価値的な機能と、ビルド時間が増大する機能については、移行しないことにしました。
当時はフロントエンドのスキル情報のためのプレイグラウンドとして色んな機能を実装していましたが、今は技術調査結果や読後レポートを公開する場として使いたいからです。

### Qiita記事情報取得・表示

これまではQiita連携のプラグインを使っていましたが、以下理由から廃止しました。

- Qiita記事とGatsby側記事の差分を埋めるため、nodeを加工して独自のIFを設ける必要があり、ブログの作りが複雑化してしまう
- 1年以上の時間軸で考えるとプラグインはメンテコストがかかる
- Qiita側でアクセストークンの発行が必要でメンテコストがかかる

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://takumon.com/2018/11/11/" data-iframely-url="//cdn.iframe.ly/api/iframe?url=https%3A%2F%2Ftakumon.com%2F2018%2F11%2F11%2F&key=0658bf78be97cafcf2b0b9f96c1270ee"></a></div></div>

### GitHubリポジトリ情報取得・表示

当時気張って作ってみたものの、普段の記事作成作業の生産性を下げるので廃止しました。

- GitHubでアクセストークンの発行が必要でメンテコストがかかる
- ビルド時間が少し長くなる
- ローカルで頻繁にビルドするとGitHubアクセス制限回数に到達しGitHub API呼び出しで401エラーになる

### WordCloud表示（記事文章中の頻出単語可視化）、d3.jsのよる記事関連性の可視化

これらも当時気張って作ってみたものの廃止しました

- 必要はライブラリが多い、1年立つと使い方を忘れてる
- ビルド時間が大幅に増加してしまう
- Gatsby v2→5更新時に画像処理系ライブラリ起因でエラー多発

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://takumon.com/wordcloud-in-gatsby-blog" data-iframely-url="//cdn.iframe.ly/api/iframe?url=https%3A%2F%2Ftakumon.com%2Fwordcloud-in-gatsby-blog%2F&key=0658bf78be97cafcf2b0b9f96c1270ee"></a></div></div>

### ビルド処理：gatsby-parallel-runnerによる画像生成処理の並列化

上３つの廃止に伴いビルド時間も短縮されました。
当時ビルド時間短縮のために導入していた本機能も、Google Cloudとの連携といった煩わしさがあったので今回を機に廃止しました。

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://takumon.com/optimizations-for-faster-gatsby-builds" data-iframely-url="//cdn.iframe.ly/api/iframe?url=https%3A%2F%2Ftakumon.com%2Foptimizations-for-faster-gatsby-builds%2F%231-%25E7%2594%25BB%25E5%2583%258F%25E7%2594%259F%25E6%2588%2590%25E5%2587%25A6%25E7%2590%2586%25E3%2582%2592%25E4%25B8%25A6%25E5%2588%2597%25E5%258C%2596%25E3%2581%2599%25E3%2582%258B&key=0658bf78be97cafcf2b0b9f96c1270ee"></a></div></div>

### ビルド処理：画像縦横幅縮小・画質低減

以下理由から廃止しました。

- WordCloudの部分でもそうでしたが画像処理系は処理が重く、ライブラリバージョンアップでエラーも付き物
- サムネイル画像を最適なサイズ・画質で作る環境は別で整えたので画像加工処理自体が不要になった

### ビルド処理：Circle CIでのビルドNetlifyへのデプロイ

GitHub Actionsに乗り換えました

### Renovate

[Renovate](https://github.com/renovatebot/renovate)（リポジトリで利用しているライブラリのバージョンアップを自動でしてくれるツール）は廃止しました。放っておくとプルリクが溜まり続けるので、１人で長期間メンテするリポジトリの場合は手動が良いと感じました。

## 残している機能

### プラグイン系

- **ダークモード切り替え**：[gatsby-plugin-dark-mode](https://www.gatsbyjs.com/plugins/gatsby-plugin-dark-mode/)を使っていましたが、TypeScriptのlint errorを解消するため[@skagami/gatsby-plugin-dark-mode](https://github.com/kagamichan/gatsby-plugin-dark-mode)に移行しました。
- **サイトマップ作成**：[gatsby-plugin-sitemap](https://www.gatsbyjs.com/plugins/gatsby-plugin-sitemap/)
- **マークダウン表現拡張**：現状維持でプラグイン郡を使っています
- **クエリからの型自動生成**：[gatsby-plugin-typegen](https://www.gatsbyjs.com/plugins/gatsby-plugin-typegen/)を使っています
- **文字スタイルテンプレート**：[gatsby-plugin-typography](https://www.gatsbyjs.com/plugins/gatsby-plugin-typography/)、テンプレートは[typography-theme-wordpress-2016](https://www.npmjs.com/package/typography-theme-wordpress-2016)を使っています
- **manifestファイル作成**：gatsby-plugin-manifest

### 自作系

- 目次作成

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://takumon.com/2018/10/28/" data-iframely-url="//cdn.iframe.ly/api/iframe?url=http%3A%2F%2Ftakumon.com%2F2018%2F10%2F28%2F&key=0658bf78be97cafcf2b0b9f96c1270ee"></a></div></div>

<br/>
<br/>

- 関連記事表示

<div class="iframely-embed"><div class="iframely-responsive" style="height: 140px; padding-bottom: 0;"><a href="https://takumon.com/gatsby-related-posts-like-hugo" data-iframely-url="//cdn.iframe.ly/api/iframe?url=http%3A%2F%2Ftakumon.com%2Fgatsby-related-posts-like-hugo&key=0658bf78be97cafcf2b0b9f96c1270ee"></a></div></div>

## まとめ

だいぶスッキリして記事が書きやすくなりました。
1年以上の時間軸で自作ブログの運用を考えると、外部連携を減らしてリポジトリのソースコードだけで完結すること、環境変数などの構成管理対象外の情報を極力減らすことがポイントだと感じました🍅
