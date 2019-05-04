---
title: 'Node.js + kuromoji.js + D3-CloudでWordCloudの画像を出力'
date: '2019-05-04T21:00:00.000+09:00'
tags:
  - Node.js
  - kuromoji.js
  - d3.js
  - d3Cloud
  - 形態素解析
  - WordCloud
keywords:
  - WordCloud
slug: /wordcloud-with-kuromoji-d3cloud-nodejs
thumbnail: /thumbnail/2019/05/wordcloud-with-kuromoji-d3cloud-nodejs.png
---

![](/thumbnail/2019/05/wordcloud-with-kuromoji-d3cloud-nodejs.png)

## なにこれ
[前回記事](/wordcloud-with-kuromoji-d3cloud-react)ではReactでWordCloudを出力できるようになりましたが、実際は、過去大量データから出力するようなツールとして使えたほうが便利です。
そこで[前回をサンプル](https://github.com/Takumon/playbox2019/blob/master/react-kuromoji-sample/src/App.js)をベースにNode.jsだけでWordCloudのSVGファイルを出力できるようなツールを作成しました。
今回はそのツールの実装方法といくつかハマったポイントがあるので、そちらをご紹介します。

※サンプルコードは以下に置いております。
https://github.com/Takumon/playbox2019/blob/master/node-kuromoji-d3cloud-sample/index.js

## 工夫

kuromoji.jsによりデータ加工についてはReactアプリの時と同様です。


```javascript:title=kuromoji.jsによる解析からD3-Cloudによるデータ加工まで
const kuromoji = require('kuromoji')


// インプットとなる文章(長文につき一部省略)
const text = `
そこも場合もうその病気らに対して旨の時がしんませ。
単に事実に使用方はどうかその応用たないでもが思いてならないがも発展思いうべきて、
あいにくにもなるだなですた。
・・・
`

// kuromoji.jsにバンドルされている辞書のフォルダパス
// kuromoji.jsは形態素解析用関数を生成する際に辞書を読み込む
const DIC_URL = 'node_modules/kuromoji/dict'

// WordCloudの情報として抽出する品詞（助詞、助動詞などは意味がないので拾わない）
const TARGET_POS = ['名詞', '動詞', '形容詞']

// kuromoji.jsの解析結果の値で特に値がない場合は以下の文字が設定される
const NO_CONTENT = '*'


async function main() {

  const words = await new Promise((resolve, reject) => {
    // 辞書を読み混んでトークナイザー（形態素解析するための関数）を生成
    kuromoji.builder({ dicPath: DIC_URL }).build((err, tokenizer) => {
      if(err){
        return reject(err)
      }

      // テキストを引数にして形態素解析
      resolve(tokenizer.tokenize(text)
        // pos（品詞）を参照し、'名詞', '動詞', '形容詞'のみを抽出
        .filter(t => TARGET_POS.includes(t.pos))
        // 単語を抽出(basic_formかsurface_formに単語が存在する)
        .map(t => t.basic_form === NO_CONTENT ? t.surface_form : t.basic_form)
        // [{text: 単語, size: 出現回数}]の形にReduce
        .reduce((data, text) => {
          const target = data.find(c => c.text === text)

          if(target) {
            target.size = target.size + 1
          } else {
            data.push({
              text,
              size: 1,
            })
          }
          return data
        }, []))
    })
  })


  // D3-Cloudによる解析処理

  // d3.jsによる描画処理
}

main()
```
<br/>



今回は単語ごとの出現回数のデータをもとにNode.jsでどうやってWordCloudの画像を出力するかについて説明します。

```javascript:title=kuromoji.jsによる解析からD3-Cloudによるデータ加工まで
const cloud = require('d3-cloud')
// Node.jsでCanvasをエミュレートするためnode-canvasを使う
const { createCanvas } = require('canvas')

// Canvasの幅(px)
const w = 1600

// Canvasの高さ(px)
const h = 1000

`

async function main() {

  // kuromoji.jsによる解析処理

  // D3-Cloudの解析によってwordsForCloudには
  // 出現回数の他にフォントの回転位置、大きさ、重み、種類が追加された状態になる
  const wordsForCloud = await new Promise(resolve => {
    cloud().size([w, h])
      // node-canvasを指定する(エラーを防ぐため)
      .canvas(() => createCanvas(w, h))
      // kuromoji.jsの解析結果を指定
      .words(words)
      // フォントの回転位置を指定
      .rotate(word => word.size % 2 === 1 ? 0 : 90)
      // フォントの重みを指定
      .fontWeight(word => Math.pow(word.size, 1.3))
      // フォントの大きさを指定
      .fontSize(word => Math.pow(word.size, 1.3))
      // フォントの種類を指定
      .font('meiryo')
      // 加工終了時のイベント登録、解析結果をd3.jsでの描画に引き継ぐ
      .on('end', (words) => resolve(words))
      // 解析開始
      .start()
  })

  // d3.jsによる描画処理
}

main()
```

TODO D3-Cloudによる解析結果の各プロパティを列挙

で最終的にd3.jsでjsdomにSVGを描画して、それをファイル出力します。

```javascript:title=d3.jsによるSVG描画処理
const fs = require('fs')
const d3 = require('d3')
const { JSDOM } = require("jsdom")

// 仮想documentオブジェクトを生成
const document = new JSDOM(`<body></body>`).window.document

// WordCloud描画領域の幅(px)
const w = 1600

// WordCloud描画領域の高さ(px)
const h = 1000


async function main() {

  // kuromoji.jsによる形態素解析

  // D3-Cloudによる解析処理

  // 仮想DOMのbodyタグを指定
  d3.select(document.body)
    // SVG形式で仮想DOMに描画
    .append('svg')
      // SVGのプロパティもろもろ指定
      .attr('class', 'ui fluid image')
      .attr('viewBox', `0 0 ${w} ${h}`)
      .attr('width', '100%')
      .attr('height', '100%')
    // SVGのグループ要素追加して
    .append('g')
      // SVGを中央寄せ
      .attr('transform', `translate(${w/2},${h/2})`)
    // テキスト要素にD3-Cloudによる解析結果を追加
    .selectAll('text')
      .data(wordsForCloud)
    // 領域を新規作成し、テキスト要素追加
    .enter().append('text')
      // フォントの大きさは解析結果通りに指定
      .style('font-size', d => `${d.size}px`)
      // フォントの種類は解析結果通りに指定
      .style('font-family', d => d.XX)
      // フォントの配色は、schemeCategory10を指定
      .style('fill', (d, i) => d3.schemeCategory10[i % 10])
      // テキストの真ん中を表示位置のポイントに指定
      .attr('text-anchor', 'middle')
      // 位置と回転位置は解析結果通りに指定
      .attr('transform', d => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
      // 単語は解析結果通りに指定
      .text(d => d.text)

    // 仮想DOMに描画されたSVGをファイル出力
    fs.writeFileSync('wordcloud.svg', document.body.innerHTML)
}

main()
```

TODO kuromoji.jsの解析とD3-Cloudの解析はパートを分ける
TODO フォント種類は、解析結果通りでいけるか試す。あと解析結果のフォントの種類のプロパティ名が不明
TODO 位置と回転位置はD3-Cloudの解析結果通り？


## ハマりポイント


### D3-Cloud + Canvasでは不十分

最初は、D3-CloudがCanvasを使えるので、node-canvasを使えばNode.jsでもReactの時と同じように画像を生成できるのでは？と考えたのですが、実際D3-Cloudだけだと、

* フォントの大きさ
* フォントの回転位置
* フォントの種類

しか定義していないので、やってみると以下のような画像になりました。

![](./wordcloud-by-using-canvas.png)


Reactの時にうまくいっていたのは、はreact-d3-cloudが

* フォントの色
* フォントのスタイル
* 表示位置

をよしなり決めてくれたからです。今回はそれを自前実装しないとうまくいきません。
そのためD3-Cloud + Canvasオンリーの組み合わせはあきらめて、
ract-d3-cloudの内部実装と同じようにd3.jsを使ってSVGに出力するような処理を実装しました。

#### D3-Cloudでnode-canvasは必要

さて、結局d3.jsを使ってWordCloudを表示するなら、
D3-Cloudの責務はデータ加工（単語の出現回数に、フォントの大きさ、回転位置、種類を追加）に限定されるなのでnode-canvasは不要かなと思いました。がCanvas指定抜きで実行するとD3-Cloudに描画する場所がないと怒られます。
D3-CloudはCanvasを指定するか、指定しない場合はDOMがあることを前提とした処理になっているからです。
そのため、結局ムダになりますがCanvasの指定は必須であることがわかりました。
しかたなく以下のような実装にしています。

```javascript:title=D3-Cloud実行時にnode-canvasを指定する
```




## まとめ

WordCloud生成をNode.jsのツールとして実行できるようになりました。
今回の実装で、ブラウザ処理はnode-canvasとjsdomを使えばNode.jsでも再現できることがわかったので、いろんな場面で応用できそうです。
次は本ツールを用いて自分のブログのWordCloudを生成してみようと思います🍅


## 参考

* [D3.js v5 カラーテーマまとめ (d3-scale-chromatic) – データビジュアライゼーション・ラボ](https://wizardace.com/d3v5-scale-chromatic/)