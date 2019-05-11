---
title: 'Vuetify + VeeValidate + VueI18nでカスタムバリデーション作成時にロケールごとのエラーメッセージを設定する方法'
date: '2019-04-07T14:10:00.000+09:00'
tags:
  - Vue.js
  - Vuetify
  - VeeValidate
  - VueI18n
keywords:
  - Vue.js
slug: /vee-validate-custom-validation-locale-message
thumbnail: thumbnail/2019/04/vee-validate-custom-validation-locale-message.png
---

## なにこれ

[Vuetify](https://vuetifyjs.com/ja/) + [VeeValidate](https://baianat.github.io/vee-validate/)で入力チェックする際に、[VueI18n](https://kazupon.github.io/vue-i18n/)を使ってエラーメッセージを多言語対応・共通化する場合に、カスタムバリデーションのエラーメッセージをロケールごとに設定する方法について紹介します。

## 実装方法

以前の記事[「Vuetify + VeeValidate + VueI18nでエラーメッセージ共通化」](https://takumon.com/vuetify-and-vee-validate-and-vue-i18n)
をベースにして、VeeValidateの定義方法を以下のようにします。
例ではMACアドレスのチェックを定義しています。

```javascript{7-11,13,14}
import Vue from 'vue';
import VeeValidate from 'vee-validate';
import ja from 'vee-validate/dist/locale/ja';
import en from 'vee-validate/dist/locale/en';
import { i18n } from './i18n';

// マックアドレスチェック
const MAC_ADDRESS = /^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$/;
VeeValidate.Validator.extend('macaddress', {
  validate: value => MAC_ADDRESS.text(value),
});

ja.messages.macaddress = field => `${field}の形式が正しくありません。`;
en.messages.macaddress = field => `format of ${field} is not collect.`;

Vue.use(VeeValidate, {
  i18n,
  i18nRootKey: 'validations',
  dictionary: {
    ja,
    en,
  },
});
```
<br/>


重要なのはこの部分です。
```javascript
import ja from 'vee-validate/dist/locale/ja';
import en from 'vee-validate/dist/locale/en';

ja.messages.macaddress = field => `${field}の形式が正しくありません。`;
en.messages.macaddress = field => `format of ${field} is not collect.`;

```
<br/>

VeeValidateのカスタムバリデーションのメッセージは通常`getMessage`で定義します。
```javascript
VeeValidate.Validator.extend('macaddress', {
  getMessage: field => `${field}の形式が正しくありません。`,
  validate: value => MAC_ADDRESS.text(value),
});
```
<br/>

ただVuetifyとi18nと合わせて使う場合は、`getMessage`ではなく、`dictionary`に登録するロケールごとのメッセージ集に追加してあげることでメッセージが有効になります。<br/>
以上です🍅