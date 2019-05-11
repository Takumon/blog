---
title: 'VueI18nをscriptタグやJSファイル内で使う方法'
date: '2019-02-21T07:50:00.000+09:00'
tags:
  - Vue.js
  - VueI18n
keywords:
  - Vue.js
slug: /vue-i18n-in-script-tag
thumbnail: thumbnail/2019/02/vue-i18n-in-script-tag.png
---

## なにこれ 
[**VueI18n**](https://kazupon.github.io/vue-i18n/)はVue.jsの多言語対応ライブラリです。vueファイルのtemplateタグでは、`<p>{{$t('message.hello')}}</p>`のように使います。ただ**vueファイルのscriptタグや、他のJavaScriptファイルでの使い方**は[ガイド](https://kazupon.github.io/vue-i18n/guide/formatting.html)に明記されていません。今回はそのやり方についてご紹介します。



## 使い方

[GitHubのIssue](https://github.com/kazupon/vue-i18n/issues/149)に答えが載っています。

<div class="iframely-embed"><div class="iframely-responsive" style="height: 168px; padding-bottom: 0;"><a href="https://github.com/kazupon/vue-i18n/issues/149" data-iframely-url="//cdn.iframe.ly/GvV4JME"></a></div></div>
<br/>

まずVueI18nを以下のように定義します。

```javascript:title=i18n.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'

const messages = {
  en: {
    message: {
      hello: 'hello world'
    }
  },
  ja: {
    message: {
      hello: 'こんにちは、世界'
    }
  }
}

Vue.use(VueI18n);

export const i18n = new VueI18n({
  locale: 'ja',
  messages,
});
```
<br/>


vueファイルのscriptタグでは以下のようにします。
**VueI18nオブジェクトの`tc`メソッドを使います。**
こうすることでvueファイルのscriptやJavaScriptファイルなど、どこでも使えるようになります。


```javascript{2-3,9}:title=vueファイルのscriptタグ
<script>
// i18nをインポートします
import { i18n } from 'i18n.jsの相対パス'

export default {
    /* (中略) */
    methods: {
        getHello() {
            return i18n.tc('message.hello');
        }    
    }
    /* (中略) */
}
</script>
```
<br/>


以上です🍅