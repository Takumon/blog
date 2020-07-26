/** 仮想DOM d3.js D3-CloudはDOMがある前提なのでNode.js実行時でも正常動作するように仮想Canvasを使う */
import { createCanvas } from 'canvas'
/** 仮想DOM d3.js D3-CloudはDOMがある前提なのでNode.js実行時でも正常動作するように仮想DOMを使う */
import { JSDOM } from 'jsdom'
import kuromoji from 'kuromoji'
import * as d3 from 'd3'
import d3Cloud, { Word } from 'd3-cloud'

import { WordCloudParam, WordCounts, TempWordCounts } from '../src/@types'

/** kuromoji.jsにバンドルされている辞書の格納場所 */
const DIC_URL = 'node_modules/kuromoji/dict'

/** WordCloudでカウントする品詞（助詞・助動詞などは省く） */
const TARGET_POS = ['名詞']

/** kuromoji.jsで該当プロパティの値が存在しない場合に設定されている値 */
const NO_CONTENT = '*'

const excludeWordsInWordCloud = [
  'よう',
  'こと',
  '指定',
  '時',
  '追加',
  '設定',
  '記事',
  '用',
  '情報',
  'ため',
  'もの',
  'これ',
  '/',
  '(',
  ')',
  '&',
  '+',
  '複数',
  '用意',
  '構成',
  '配下',
  '下記',
  '今回',
  '確認',
  '公開',
  '関連',
  '取得',
  '作成',
  '場合',
  '定義',
  '方法',
  '生成',
  '実行',
  '表示',
  '紹介',
  '資産',
  '参考',
  '機能',
  '以下',
  '更新',
  '化',
  '必要',
  '一部',
  '側',
  '実装',
  'ファイル',
  'サイト',
  'イン',
  '自分',
  'プラグ',
  '的',
  'さん',
  'とき',
  'の',
  '系',
  '便利',
  '簡単',
  '使用',
  'それ',
  'あれ',
  '感じ',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  'SETTINGS',
  'MS',
  'CONFIG',
  '://',
]

export function createWordCount(text: string): Promise<WordCounts> {
  // kuromoji.jsで形態素解析
  // 単語ごとの出現回数を出力
  return new Promise((resolve, reject) => {
    kuromoji.builder({ dicPath: DIC_URL }).build((err, tokenizer) => {
      if (err) {
        return reject(err)
      }

      // 単語ごとの出現回数を出力
      const words: WordCounts = tokenizer
        .tokenize(text)
        .filter(t => TARGET_POS.includes(t.pos))
        .map(t => (t.basic_form === NO_CONTENT ? t.surface_form : t.basic_form))
        .reduce(
          (data, text) => {
            const upperText = text.toUpperCase()
            if (excludeWordsInWordCloud.includes(upperText)) {
              return data
            }

            const target = data.find(c => c.text === upperText)

            if (target) {
              target.size = target.size + 1
              if (!target.rawTexts.includes(text)) {
                target.rawTexts.push(text)
              }
            } else {
              data.push({
                text: upperText,
                rawTexts: [text],
                size: 1,
              })
            }
            return data
          },
          [] as TempWordCounts
        )
        .map(data => {
          const almostSameText = data.rawTexts
            .map(text => {
              return {
                text,
                diff: countDiff(text, data.text),
              }
            })
            .reduce((a, b) => (a.diff <= b.diff ? a : b)).text // 大文字に近いほうを採用する

          return {
            text: almostSameText,
            size: data.size,
          }
        })

      resolve(words)
    })
  })
}

export async function createWordCloud({ words, w, h, fontSizePow, fontSizeZoom, padding }: WordCloudParam): Promise<string> {
  // D3-Cloudによる解析
  const wordsForCloud = await new Promise<Word[]>(resolve => {
    d3Cloud()
      .size([w, h])
      .canvas(() => {
        const result = createCanvas(w, h)
        return result as any
      })
      .words(words)
      .rotate(word => (word.size ? (word.size % 2 === 1 ? 0 : 90) : 0))
      .fontWeight(word => (word.size ? Math.pow(word.size, fontSizePow) * fontSizeZoom : 16 * fontSizeZoom))
      .fontSize(word => (word.size ? Math.pow(word.size, fontSizePow) * fontSizeZoom : 16 * fontSizeZoom))
      .font('meiryo')
      .padding(padding)
      .on('end', (wordsForCloud: Word[]) => {
        resolve(wordsForCloud)
      })
      .start()
  })
  // d3.jsによる解析

  /** 仮想DOM */
  const document = new JSDOM(`<body></body>`).window.document
  const anyD3 = d3 as any

  anyD3
    .select(document.body)
    .append('svg')
    .attr('class', 'ui fluid image')
    .attr('viewBox', `0 0 ${w} ${h}`)
    .attr('width', '100%')
    .attr('height', '100%')
    .append('g')
    .attr('transform', `translate(${w / 2},${h / 2})`)
    .selectAll('text')
    .data(wordsForCloud)
    .enter()
    .append('text')
    .style('font-size', (d: { size: number }) => `${d.size}px`)
    .style('font-family', (d: { font: string }) => d.font)
    .attr('transform', (d: { x: string; y: string; rotate: string }) => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
    .style('fill', (d: any, i: number) => d3.schemeCategory10[i % 10])
    .attr('text-anchor', 'middle')
    .text((d: { text: any }) => d.text)

  // 最終的にSVGの文字列を返す
  return document.body.innerHTML
}

function countDiff(a: string, b: string) {
  return a
    .split('')
    .map((charA, i) => (charA === b[i] ? 0 : 1))
    .reduce((sum: number, count: number) => sum + count, 0)
}
