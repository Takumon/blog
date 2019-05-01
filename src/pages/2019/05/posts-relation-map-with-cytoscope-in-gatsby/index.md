---
title: 'GatsbyでCytoscape.jsを使って記事関連マップを作ってみた'
date: '2019-05-01T21:00:00.000+09:00'
tags:
  - Gatsby
  - Cytoscope.js
keywords:
  - Gatsby
slug: /posts-relation-map-with-cytoscope-in-gatsby
thumbnail: /thumbnail/2019/05/posts-relation-map-with-cytoscope-in-gatsby.png
---

![](/thumbnail/2019/05/posts-relation-map-with-cytoscope-in-gatsby.png)

## なにこれ
[以前紹介したタグとキーワードから関連記事を算出するロジック](https://takumon.com/gatsby-related-posts-like-hugo)と、 [Cytoscope.js](http://js.cytoscape.org/)を用いて記事の関連情報を視覚的に確認できるページを作りました。今回はそのページとCytoscape.jsを使ってみた感想をご紹介します。

## 記事関連マップ

### 使い方
URL: https://takumon.com/map <br/>
遷移方法: 一覧ページから遷移できます。 <br/>
![](./map-link.png)
<br/>

マップをフルスクリーン表示できたり...
![](./fullscreen-button.png)
<br/>

記事にマウスカーソルを合わせると拡大され、関連線が青にハイライトされたり...
![](./hover-style.png)
<br/>

記事をクリックすると記事ページに飛べたりします。


### 自分が書いてきた記事が視覚的に俯瞰できるのでとても良い

以前から関連記事機能は実装していましたが、マップにするとそれらを視覚的に俯瞰できるので、改めて気付いたことがいくつかありました。

マップを見る限り自分のブログのメインコンテンツとしては以下ですね。フロントエンド多めです。

* Gatsby(ちょっとReact)
* Vue.js + AppSync
* Angular


まったく関連記事が存在しないも幾つかあることがわかります（Git,Vimあたり）。知識は点よりも線にしたほうが強みになるので、今後記事を書く際は、そこらへんの記事の関連線を増やしていく方向で学習を進めていきたいです。


今は関連度をタグとキーワードの重み付けという簡素なロジックで測っていますが、今後は記事の中身を解析して詳細な関連度をだしたり、記事の傾向を見たりとう追加機能を実装していきたいです。あとはWordCloudを出すのみ楽しそうです。自作ブログはいろいろ自分の好きな機能を追加できるのが良いですね。


## Cytoscape.js

### 使ってみた感想

Canvasで描画するので、オブジェクトのスタイル指定でCSSは使えません。
若干もどかしい感じですが、CSSに似たプロパティをオブジェクトに指定しることでかなり細かい調整ができます。

またオブジェクト毎にhover時、Click時、Mouseover時の挙動を指定できたりします。ここはjQueryっぽい実装です。

サンプルが豊富で、拡張機能も多数存在します。ただjQuery依存の拡張機能もあったりして、今回はReactベースなのでいくつか採用をあきらめたものもあります。

今回ZOOMボタンを拡張機能で担保しようとしましたが、jQuery依存だったので自前実装しました。実装が難しいというよりは、スタイルや細かい挙動など設定すべきプロパティが非常におおいので、結構めんどくさいです。
公式ドキュメントは充実しているので、それを読めば実装方法がわからないということはありませんでした。

### react-cytoscope.jsハマりポイント

今回GatsbyでCytoscape.jsを使えるようにするため[react-cytoscope.js](https://github.com/plotly/react-cytoscapejs)を採用しました。
ただ2点困ったことがありました・


#### 1. wheelsensitivityが使えない
本家ではwheelsensitivityというプロパティでマウスホイールでの拡大時の拡大率を調整できます。これを設定しないとマウスホイールで拡大したときに、いきなしめっちゃ拡大されて、自分が今どこにいるのかわからなくなります。それを防ぐために少しずつ拡大できるようにするためのプロパティです。

ただコレreact-cytoscopeではサポートしていません。ので今回はwheelsensitivityの指定はあきらめました。

#### 2. Gatsbyビルド時にエラー
`WebpackError: ReferenceError: window is not defined`というエラーが出ます。react-cytoscope.jsではwindowオブジェクトを直参照しており、Gatsbyのビルド時にWebpackに怒られます。Gatsbyではwindowオブジェクトを直参照できないようです。

対策としては、[Gatsgyでイシュー](https://github.com/gatsbyjs/gatsby/issues/309#issuecomment-302043875)があがっており、そちらを参考にして、ライブラリの中身を直接書き換えました。

* 対象ファイルはnode_modules\react-cytoscapejs\dist\react-cytoscape.js
* 冒頭に`const windowGlobal = typeof window !== 'undefined' && window;`を追記
* `window`を`windowGlobal `に置換

これでビルドが通りデプロイ後の正常動作しました。ただ手動でやるのは無理やり感があるので、将来的にはnpmのpostinstallでライブラリの中身を書き換える
スクリプトを追加したいと考えています。


## まとめ
今回は、記事関連マップの紹介と[Cytoscope.js](http://js.cytoscape.org/)を使ってみた感想をご紹介しました。
Webで可視化したいという要件は割とある気がするので、そんなときはCytoscope.jsを使おうと思います。
自作ブログは、色々自分好みにカスタマイズできるし、カスタマイズしたこと自体が知見として記事にできるので、はてなブログなどのブログプラットフォームにはない良さがあるなぁと改めて認識しました🍅