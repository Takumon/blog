---
title: 'React NativeのTextタグで改行したいけど{\n}は使いたくない時はTagged Template Literalsを使う'
date: '2020-07-24T15:30:00.000+09:00'
tags:
  - ReactNative
  - CrossPlatform
  - Mobile
keywords:
  - Mobile
slug: /how-to-write-multi-line-text-in-text-tag-by-using-tagged-template-literals-in-es6
thumbnail: thumbnail/2020/07/how-to-write-multi-line-text-in-text-tag-by-using-tagged-template-literals-in-es6.png
---

## なにこれ

React NativeのTextタグで複数行テキストを書きたいけど改行がめんどくさいので、どうしようという話です。
Tagged Template Literalsを使えばスッキリ書けます。以下に動くソースコードを用意しています。

<blockquote class="embedly-card">
  <h4>
    <a href="https://snack.expo.io/@takumon/multi-line-text-in-text-tag-of-react-native">Multi line text in Text tag of React Native</a>
  </h4>
  <p>This is a simple sample to write multi line text concisely in Text tag of React Native by using tagged template literals in ES6. The tag function removes indents of each line and trims blank lines.</p>
</blockquote>
<script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script>


<div class="iframely-embed">
  <div class="iframely-responsive" style="height: 140px; padding-bottom: 0;">
    <a href="https://snack.expo.io/@takumon/multi-line-text-in-text-tag-of-react-native" data-iframely-url="//cdn.iframe.ly/HAwniZ1"></a>
  </div>
</div>

## いろいろ調べた

### 公式リファレンス
まずは[React Nativeのリファレンス](https://reactnative.dev/docs/text)を見ます。
Textタグのプロパティには、改行をコントロールするようなものはなさそうでした。
ただ、サンプルとして載っていたコードには`{"\n"}`で改行(というよりmargin button)を指定していました。
とりあえず`{"\n"}`を使えば、改行できそうです。が、ちょっとめんどくさいし見た目が煩雑になってしまいます。


### StackOverFlow

StackOverFlowで他にやりかたないか調べたところ以下の質問がヒットしました。

<div class="iframely-embed">
  <div class="iframely-responsive" style="height: 140px; padding-bottom: 0;">
    <a href="https://stackoverflow.com/questions/32469570/how-can-i-insert-a-line-break-into-a-text-component-in-react-native" data-iframely-url="//cdn.iframe.ly/MDEwzC6"></a>
  </div>
</div>
<br/>

1番いいねが多かった回答は公式リファレンスと同じやりかたです。 React Nativeでは`{"\n"}`で改行が普通なのでしょうか...

しかし、2番目に人気の回答は参考になりました。Template Literalを使う方法です。

```
<Text>{`
Hi~
this is a test message.
`}</Text>
```
<br/>

これは、良さそうです。ただ以下のようにインデントしたTextタグ中でキレイに書こうとすると、画面上でもインデントされた状態になってしまいます。

```
  <View>
    <Text>{`
      Hi~
      this is a test message.
    `}</Text>
  </View>
```
<br/>

![](./rendering-result.png)


そこで、ES6のTagged Template Literalsを使うことにしました。
Tagged Template Literalsのタグ関数でインデントを除去すれば、以下のようにスッキリ描けます。


```jsx:title=Tagged Template Literalsを使った書き方
  <View>
    <Text>{noIndent `
      Hi~
      this is a test message.
  `}</Text>
```
<br/>

タグ関数では以下のような感じです。

```js:title=Tagged Template Literalsのタグ関数
// Tagged Templates function
function noIndent(strs, ...placeholders) {
  const original = placeholders.map((placeholder, i) => strs[i] + placeholder) + strs[strs.length - 1];
  return removeIndent(original);
}

// for removing indents of each line and trims blank lines.
function removeIndent(value) {
  const indentRemovedLines = value.split('\n').map((line) => line.replace(/^[^\S\n]+/g, ''));

  const [firstLine, ...lines] = indentRemovedLines;
  const [lastLine, ...reversedRestLines] = [...lines].reverse();
  const restLines = [...reversedRestLines].reverse();

  const firstLastLineTrimmed = [...(firstLine ? [firstLine] : []), ...restLines, ...(lastLine ? [lastLine] : [])].join('\n');
  return firstLastLineTrimmed;
}
```
<br/>

レンダリングもバッチリです。インデントは除去されています。

![](./rendering-result.png)
<br/>


一点微妙なのは、タグ関数中でテキスト上下空行を問答無用で除去してしまっている点です。
タグ関数のオプション引数で渡して、除去するか選べるようにしたかったのですが、どうやらそれは[Tagged Template Literalsの仕様](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)上できないようです。


## 最後に

以前[Ionicについての記事](https://takumon.com/ionic-summary-and-comparison-with-react-native-and-flutter-2020)を書きましたが、今後はReact Nativeをしばらく使いそうです。
モバイル開発においてネイティブの部分はさっぱりですが、React NativeはReactの書き方をそのまま使えるのがメリットとしては大きいです。
若干Reactと違う部分もあったりするので、今後はそこに関するノウハウを記事にできたらイイなと思っています🍅


## 参考

- [Text · React Native](https://reactnative.dev/docs/text)
- [javascript - How can I insert a line break into a <Text> component in React Native? - Stack Overflow](https://stackoverflow.com/questions/32469570/how-can-i-insert-a-line-break-into-a-text-component-in-react-native)
- [Tagged Template Literals - Wes Bos](https://wesbos.com/tagged-template-literals)
- [Template literals (Template strings) - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

