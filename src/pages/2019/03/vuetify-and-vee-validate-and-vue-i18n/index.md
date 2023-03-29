---
title: 'Vuetify + VeeValidate + VueI18nでエラーメッセージ共通化'
date: '2019-03-02T12:30:00.000+09:00'
tags:
  - Vue.js
  - Vuetify
  - VeeValidate
  - VueI18n
keywords:
  - Vue.js
slug: /vuetify-and-vee-validate-and-vue-i18n
thumbnail: thumbnail/2019/03/vuetify-and-vee-validate-and-vue-i18n.png
---

## なにこれ

[Vuetify](https://vuetifyjs.com/ja/) + [VeeValidate](https://baianat.github.io/vee-validate/)で入力チェックする際に、[VueI18n](https://kazupon.github.io/vue-i18n/)を使ってエラーメッセージを多言語対応・共通化する方法について紹介します。



## 定義方法

### VeeValidate

VeeValidateであらかじめ言語毎にエラーメッセージを用意しているので、そちらを使います。
※`i18nRootKey`については後述の[vuei18nのメッセージファイル](#vuei18nのメッセージファイル)で詳細を説明します。

```javascript{4,6}:title=VeeValidateの定義
import Vue from 'vue';
import VeeValidate from 'vee-validate';
// VeeValidateで用意されている日本語版入力チェックエラーメッセージを使う
import ja from 'vee-validate/dist/locale/ja';
// VeeValidateで用意されている英語語版入力チェックエラーメッセージを使う
import en from 'vee-validate/dist/locale/en';
// VueI18nオブジェクトをインポートする
import { i18n } from './i18n';

Vue.use(VeeValidate, 
  // オプションでi18nを指定する
  {
    i18n,
    i18nRootKey: 'validations',
    dictionary: { ja, en },
  }
);
```
<br/>


### VueI18n

こちらは以前[「VueI18nをscriptタグやJSファイル内で使う方法」](vue-i18n-in-script-tag#%E4%BD%BF%E3%81%84%E6%96%B9)で紹介したものと同様です。

```javascript:title=VueI18nの定義
import Vue from 'vue';
import VueI18n from 'vue-i18n';
// メッセージ定義はjsonファイルから読み込む
const messages = require('./i18n.json');

Vue.use(VueI18n);

// ブラウザ言語を取得
const language = (
  (
    window.navigator.languages
    && window.navigator.languages[0]
  )
  || window.navigator.language
  || window.navigator.userLanguage
  || window.navigator.browserLanguage
  || 'ja'
);

const locale = language.substr(0, 2) === 'ja' ? 'ja' : 'en';

// VueI18nで使う言語はブラウザ言語とする
export const i18n = new VueI18n({
  locale,
  messages,
});

```
<br/>


### VueI18nのメッセージファイル

VeeValidateの定義で`i18nRootKey: 'validations',`と指定したので、
メッセージファイルでは、言語別に`validations`というプロパティを定義します。
その中の`attributes`でエラー項目名を指定できます。

```json{3-4,10-11}:title=VueI18nのメッセージファイル(JSONファイル)
{
  "ja": {
    "validations": {
      "attributes": {
        "contractName": "契約名",
      }
    }
  },
  "en": {
    "validations": {
      "attributes": {
        "contractName": "ContractName",
      }
    }
  },
}
```


## Vueファイルでの使い方

Vuetifyの`v-text-field`タグの場合、以下のように実装します。

```html{5-8,24}
<template>
  <v-text-field
    v-model="editedItem.name"
    <!-- VeeValidateでの項目名を定義 -->
    <!-- ※i18nのメッセージファイルで定義している項目名と合わせる -->
    data-vv-name="contractName"
    <!-- data-vv-nameで定義した名前でエラーメッセージを取得する -->
    :error-messages="errors.collect('contractName')"
    >
  </v-text-field>
  <button @click="validate">入力チェック</button>
</template>
<script>
export default {
  data() {
    return {
      editedItem: {
        name: '',
      },
    };
  },
  methods: {
    async validate() {
      const valid = await this.$validator.validateAll();
      if (!valid) {
        console.log('入力チェックNGです！！！');
      }
    }
  }
}
</script>
```
<br/>


以上です🍅

## 参考
* [Localization | VeeValidate](https://baianat.github.io/vee-validate/guide/localization.html#vuei18n-integration)