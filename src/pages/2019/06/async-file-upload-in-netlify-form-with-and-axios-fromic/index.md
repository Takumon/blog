---
title: 'Netlify Formでファイルを非同期アップロード with React + Formic + Axios'
date: '2019-06-1T12:00:00.000-07:00'
tags:
  - Netlify
  - React
  - Fromic
  - Axios
keywords:
  - Netlify
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

```html{8-12}:title=index.html
<!-- (中略) -->
  <!-- name：Formの名前NetlifyのおけるFormの識別子となる -->
  <!-- novalidate：Formicで入力チェックするためブラウザの入力チェックはオフ -->
  <!-- data-netlify：NetlifyでFormを認識させるための属性 -->
  <!-- netlify-honeypot：NetlifyでFormを認識させるための属性 -->
  <form
    method="POST"
    name="contact"
    novalidate="true"
    data-netlify="true"
    netlify-honeypot="bot-field"
  >
    <input type="text" name="sampleText"/>
    <input type="file" name="sampleFile"/>
    
    <!-- 送信ボタン -->
    <button type="submit" >
      SUBMIT
    <button>
  </form>
<!-- (中略) -->
```
<br/>


## Step.2 React、ファイル同期送信

次にReactの場合です。Reactの場合はフォーム情報に`bot-field`と`form-name`を付与する必要があります。
これらは`<input type="hidden">`で実装します。

```jsx{9-13}:title=SampleForm.jsx
export default () =>  (
  <form
    name="contact" {/* Formの名前NetlifyのおけるFormの識別子となる */}
    method="POST"
    novalidate="true" {/* Formicで入力チェックするためブラウザの入力チェックはオフ */}
    data-netlify="true"  {/* NetlifyでFormを認識させるための属性 */}
    netlify-honeypot="bot-field" {/* NetlifyでFormを認識させるための属性 */}
  >
    {/* NetlifyFormで必要な値 */}
    <input type="hidden" name="bot-field" />
    {/* NetlifyFormで必要な値 */}
    <input type="hidden" name="form-name" />

    <input type="text" name="sampleText"/>
    <input type="file" name="sampleFile"/>
    
    {/* 送信ボタン */}
    <button type="submit" >
      SUBMIT
    <button>
  </form>
);

```
<br/>

## Step.4 React + Formic、ファイル同期送信

Netlify Formはサーバー側のバリデーション機能はないので、
実際使うときはフロント側のバリデーションが必要です。
ここでは、Reactのバリデーションライブラリ[Fromic]()を使ってバリデーションを追加します。

入力チェックエラーメッセージ表示はコンポーネント化します。そのほうがすっきりするので。

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
<br/>


入力フォームのコンポーネントはFormicの作法にしたがって
* `initialValues`:入力フォーム初期値設定処理
* `validate`: 入力チェック処理
* `render`: 入力フォーム描画処理
を実装します。<br/>
ただしファイルについてはFormicが用意している`Field`タグは`type=file`をサポートしていないので、HTMLの`input`タグでファイル変更時に手動でFormicにファイルを追加します。

```jsx:title=SampleForm.jsx
import React from 'react';
import { navigate } from "gatsby"
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


// Form描画処理
const renderForm = ({
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
      { isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
    <button>
  </form>
);


// Form用Reactコンポーネント
export default () =>  (
  <Formik
    initialValues={initialValues}
    validate={handleValidate}
    render={renderForm}
  />
);
```
<br />

これでNetlify FormへのFileアップロードが同期通信で可能になりました。


## Step.5 React + Formic + Axios、ファイル非同期送信

Reactを使っている場合、SPAなので同期通信は極力控えたほうが良いです。
そのため入力フォームの送信も非同期でやるのが現実的でしょう。
`Formic`タグは`onSubmit`プロパティでサブミット処理を自分で定義できます。
この`onSubmit`にて、axiosを使うことで非同期処理が可能になります。
以下に実装詳細を示しますが、大半は前セクションと同じなので差分にフォーカスして説明します。


エラーメッセージ用コンポーネントは前回と同じなので割愛します。

以下フォーム用コンポーネントです。


```jsx{5,14-44}:title=SampleForm.jsx
import React from 'react';
import { navigate } from "gatsby"
import { Formik, Field } from 'formik';
import ErrorMessage from './ErrorMessage';
import axios from "axios";

// フォームの値を初期化
/* (略) */

// 入力チェック
/* (略) */

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
    {/* (中略) */}
  </form>
);


// Form用Reactコンポーネント
export default () =>  (
  <Formik
    initialValues={initialValues}
    validate={handleValidate}
    render={renderForm}
    onSubmit={handleSubmit}
  />
);
```
<br />

これでようやくNetlify Formにおいて非同期でファイルアップロードできるようになりました！


## まとめ

自分の復習も兼ねてステップごとに実装方法をご紹介しました。
静的サイトを作るときにお問い合わせフォームが必要でWordPressを採用するケースは多いと思いますが、
Netlify Formを使えば、手間いらずでReactなどの単純なSPAでもお問い合わせフォームを作ることができます。
最近話題のReact製静的サイトジェネレーターGatsbyと組み合わせても良いでしょう🍅


## 参考



