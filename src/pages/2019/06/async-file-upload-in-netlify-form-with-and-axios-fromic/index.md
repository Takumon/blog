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



```jsx:title=ErrorMessage.jsx
import React from "react"
import { Field, getIn } from 'formik';

// Formicエラーメッセージ表示用コンポーネント
export default ({ name }) => (
  <Field
    name={name}
    render={({ form }) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      cosnt isShowError = touch && error;

      return isShowError
        ? <div>{error}</div>
        : null;
    }}
  />
);
```


```jsx
import React from 'react';
import { navigate } from "gatsby"
import axios from "axios";
import { Formik, Field } from 'formik';
import ErrorMessage from './ErrorMessage';


// フォームの値を初期化
const initialValues = {
  'form-name': 'contact', // NetlifyFormで必要な値
  'bot-field': '', // NetlifyFormで必要な値
  sampleText] '',
  sampleFile: null,
};


// 入力チェック
const handleValidate = (values) => {
  let errors = {}

  // sampleText
  if (!values.sampleText) {
    errors.sampleText = `テキストを記入してください`;
  }

  // sampleFile
  if (!values.sampleFile) {
    errors.sampleFile = `ファイルを添付してください`;
  } else if (values.sampleFile.size > 100000000) {
    errors.sampleFile = `100MB以下のファイルを添付してください`;
  }

  return errors;
}


// サブミット処理
const handleSubmit = (values, actions) => {

  // FormData作成
  const  params = new FormData();

  params.append('form-name', values['form-name']);  // for Netlify Form
  params.append('bot-field', values['bot-field']);  // for Netlify Form
  params.append('sampleText', values['sampleText']);
  params.append('sampleFile', values['sampleFile']);

  // Formicの送信中フラグをオンにする
  actions.setSubmitting(true);
  // axiosで非同期にお問い合わせフォームを送信
  axios({
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: params,
    url: "/"
  }).then(res => {
    // フォーム送信完了後
    // 他画面に遷移（同期遷移ではなくSPAとしての遷移）
    navigate('/application-complete');
    // フォーム内容初期化
    actions.resetForm();

    // 最後にFormicの送信中フラグをオフにする
    actions.setSubmitting(false);
  }).catch(err => {
    // なにかしらエラーハンドリング
    actions.setSubmitting(false);

    /* (中略) */
  });
}


// Form描画処理
const renderForm = ({
  handleSubmit,
  dirty,
  isSubmitting,
  setFieldValue,
}) => (
  <form
    name="contact" {/* Formの名前NetlifyのおけるFormの識別子となる */}
    method="POST"
    novalidate="true" {/* Formicで入力チェックするためブラウザの入力チェックはオフ */}
    data-netlify="true"  {/* NetlifyでFormを認識させるための属性 */}
    netlify-honeypot="bot-field" {/* NetlifyでFormを認識させるための属性 */}
    onSubmit={handleSubmit}
  >
    <Field type="hidden" name="bot-field" /> {/* NetlifyFormで必要な値 */}
    <Field type="hidden" name="form-name" /> {/* NetlifyFormで必要な値 */}

    <Field type="text" name="sampleText"/>
    <ErrorMessage name="sampleText" />

    {/* FormicのFieldタグではなくHTMLのinputタグを使う */}
    <input
      id="sampleFile"
      name="sampleFile"
      type="file"
      {/* ファイル変更時に、手動でFormicの値に設定 */}
      onChange={event => setFieldValue("sampleFile", event.currentTarget.files[0])}
    />
    <ErrorMessage name="sampleFile" />
    
    {/* 送信ボタン */}
    <button type="submit" disabled={isSubmitting} >
      { isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
    <button>
  </form>
);


// Form用Reactコンポーネント
export default ({ job }) =>  (
  <Formik
    initialValues={initialValues}
    validate={handleValidate}
    onSubmit={handleSubmit}
    render={renderForm}
  />
);
```
<br />



## まとめ

自分の復習も兼ねてステップごとに実装方法をご紹介しました。
静的サイトを作るときにお問い合わせフォームが必要でWordPressを採用するケースは多いと思いますが、
Netlify Formを使えば、手間いらずでReactなどの単純なSPAでもお問い合わせフォームを作ることができます。
最近話題のReact製静的サイトジェネレーターGatsbyと組み合わせても良いでしょう🍅


## 参考



