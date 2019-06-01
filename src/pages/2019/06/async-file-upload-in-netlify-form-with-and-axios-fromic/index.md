---
title: 'Netlify Formでファイルを非同期アップロード with React + Formic + Axios'
date: '2019-06-1T12:00:00.000-07:00'
tags:
  - Gatsby
  - gatsby-image
keywords:
  - Gatsby
slug: /async-file-upload-in-netlify-form-with-and-axios-fromic
thumbnail: thumbnail/2019/06/async-file-upload-in-netlify-form-with-and-axios-fromic.png
---

## なにこれ

NetlifyFormは静的サイトでお問い合わせフォームを作れる協力な機能です。
データはNetlify側で保持してくれてCSVダウンロードなどもできます。Zapiarなどの連携すると、お問い合わフォームのEMail宛てに定型フォーマットのメールを送信したりもできます。
そんな便利なNetlify Formですが、ググってみても同期的にFormを送信する簡単は方法しかサンプルが載っていません。
そこで今回はもう少し実用的な例として、
* ReactでFornバリデーションに[Formic]()を使いつつ
* ファイルアップロードを含むお問い合わせフォームを実装し
* [axios]()で非同期に送信する
方法をご紹介します。

## Step.1 単純なHMLT、ファイル同期送信

モットも単純なパターン、こちらNetlifyの[公式サイト]に書いてある通りに実装します。

```html
TODO 後で調べる
```


## Step.2 React、ファイル同期送信

次にReactの場合です。Reactの場合は、``と``をお問い合わせ情報に付与する必要があります。
ただ実際のお問い合わせフォームには表示したくないので`<input type="hidden">`で実装します。

```jsx
```

## Step.4 React + Formic、ファイル同期送信

続いてReactでFromicを使ってバリデーションする場合です。
Netlify Formはサーバー側のバリデーション機能はないので、
実際のWebサイトでは必ずフロント側でバリデーションすると思います。

ここの事例はどちらかというとFormicの使い方の紹介ですが、Netlify Formと合わせて使う場合の例として示します。



## Step.5 React + Formic + Axios、ファイル非同期送信

今まではずっと同期通信でお問い合わせフォームを送信していましたが、実際リッチはWebサイトを作る場合、
SPAで非同期でやりたいケースが多いと思います、そういった時にReact + FormicにさらにAxiosを追加して、
以下のように実装できます。

```jsx
```


## まとめ

自分の復習も兼ねてステップごとに実装方法をご紹介しました。
静的サイトを作るときにお問い合わせフォームが必要でWordPressを採用するケースは多いと思いますが、
Netlify Formを使えば、手間いらずでReactなどの単純なSPAでもお問い合わせフォームを作ることができます。
最近話題のReact製静的サイトジェネレーターGatsbyと組み合わせても良いでしょう🍅


## 参考



