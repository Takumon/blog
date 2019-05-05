const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const _flow = require('lodash/fp/flow')
const _forEach = require('lodash/fp/forEach')
const _uniq = require('lodash/fp/uniq')
const _flatMap = require('lodash/fp/flatMap')
const relatedPost = require('./gatsby-related-post')

const striptags = require('striptags')

/** 仮想DOM d3.js D3-CloudはDOMがある前提なのでNode.js実行時でも正常動作するように仮想Canvasを使う */
const { createCanvas } = require('canvas')
/** 仮想DOM d3.js D3-CloudはDOMがある前提なのでNode.js実行時でも正常動作するように仮想DOMを使う */
const { JSDOM } = require('jsdom')
const kuromoji = require('kuromoji')
const d3 = require('d3')
const cloud = require('d3-cloud')
const fs = require('fs')

const POST_TYPE = {
  ORIGINAL: 'original',
  QIITA: 'qiita'
}


// onCreateNodeより後に実行される
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js');
    const qiitaPost = path.resolve('./src/templates/qiita-post.js');
    const tagPage =  path.resolve('./src/templates/tags.js');
    const postRelationMapPage = path.resolve('./src/templates/post-relation-map.js');

    resolve(
      graphql(
        `
          {
            allMarkdownRemark(sort: { fields: [fields___date], order: DESC }, limit: 1000) {
              edges {
                node {
                  html
                  fields {
                    slug
                    title
                    date
                    excerpt
                    tags
                    keywords
                    thumbnail
                  }
                }
              }
            }
            allQiitaPost(sort: { fields: [fields___date], order: DESC }, limit: 1000) {
              edges {
                node {
                  fields {
                    slug
                    title
                    date
                    excerpt
                    tags
                    keywords
                    thumbnail
                  }
                  id
                  title
                  rendered_body
                  body
                  comments_count
                  created_at
                  likes_count
                  reactions_count
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }


        // オリジナル記事とQiitaの記事を1つのリストにする
        const originalPosts = result.data.allMarkdownRemark.edges.map(p => {
          return {
            type: POST_TYPE.ORIGINAL,
            date: new Date(p.node.fields.date),
            node: p.node
          }
        })

        const qiitaPosts = result.data.allQiitaPost.edges.map(p => {
          return {
            type: POST_TYPE.QIITA,
            date: new Date(p.node.fields.date),
            node: p.node
          }
        })

        const posts = [...originalPosts, ...qiitaPosts].sort((a,b) => {
          if( a.date < b.date ) return 1
          if( a.date > b.date ) return -1
          return 0
        })

        const allPostNodes = _.map(posts, ({node}) => node)


        // 記事詳細ページ生成
        _.each(posts, ({type, node}, index) => {

          // 最大5つ関連記事を取得
          const relatedPosts = relatedPost.extractRelatedPosts(allPostNodes, node, relatedPost.defaultConfig).slice(0,5)
          const latestPosts = allPostNodes.slice(0,5)

          if (type === POST_TYPE.ORIGINAL) {
            createPage({
              path: node.fields.slug,
              component: blogPost,
              context: {
                slug: node.fields.slug,
                relatedPosts,
                latestPosts,
                ...previouseAndNext(posts, index)
              },
            })

          } else if (type === POST_TYPE.QIITA) {
            createPage({
              path: node.fields.slug,
              component: qiitaPost,
              context: {
                slug: node.fields.slug,
                relatedPosts,
                latestPosts,
                ...previouseAndNext(posts, index)
              },
            })

          } else {
            throw new Error(`Unexpected post type = ${type}`)
          }
        })

        const allPostRelations = allPostNodes.map(node => {

          const conf = Object.assign({}, relatedPost.defaultConfig, { threshold: 50 })

          return {
            node,
            relations: relatedPost.extractRelatedPostRankings(allPostNodes, node, conf),
          }
        })

        const alltext = posts
          .map(({ type, node }) => {
            if (type === POST_TYPE.ORIGINAL) {
              return rawText(node.html)
            } else {
              return rawText(node.rendered_body)
            }
          })
          .join('\n')
        

        const tagDatas = []

        posts.forEach(post => {
          post.node.fields.tags.forEach(t => {
            if ('Qiita' === t) {
              return
            }

            const targetData = tagDatas.find(data => data.text === t)
            if (targetData) {
              targetData.size = targetData.size + 1
            } else {
              tagDatas.push({
                text: t,
                size: 1,
              })
            }
          })
        })

        createWordCloud({
          words: tagDatas,
          w: 1200,
          h: 630,
          fontSizePow: 0.8,
          fontSizeZoom: 18,
          padding: 2,
        })
          .then(tagSvg => {
            craeteWordCount(alltext)
              .then(data => 
                createWordCloud({
                  words: data,
                  w: 1200,
                  h: 630,
                  fontSizePow: 0.6,
                  fontSizeZoom: 3.1,
                  padding: 0.2,
                })
              )
              .then(textSvg => {
                createPage({
                  path: '/map/',
                  component: postRelationMapPage,
                  context: {
                    allPostRelations,
                    wordCloudText : textSvg,
                    wordCloudTag: tagSvg,
                  },
                })
              })
          })

        




        // タグ別一覧ページ生成
        _flow(
          _flatMap(post => post.node.fields.tags),
          _uniq(),
          _forEach(tag => {
            createPage({
              path: `/tags/${_.kebabCase(tag)}/`,
              component: tagPage,
              context: {
                tag
              },
            })
          })
        )(posts)
      })
    )
  })
}


/**
 * 指定したインデックスの記事の前後の記事を取得する.
 *
 * @param {Array} posts 記事一覧
 * @param {int} index 対象記事のインデックス
 */
function previouseAndNext(posts, index) {
  return {
    previous: index === posts.length - 1 ? null : posts[index + 1].node,
    next: index === 0 ? null : posts[index - 1].node
  }
}


function countDiff(a, b) {
  return a
    .split('')
    .map((charA, i) => charA === b[i] ? 0 :1)
    .reduce((a, b) => a + b, 0)
}

function craeteWordCount(text, w, h) {
  
  const excludeWords = [
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


  /** kuromoji.jsにバンドルされている辞書の格納場所 */
  const DIC_URL = 'node_modules/kuromoji/dict'

  /** WordCloudでカウントする品詞（助詞・助動詞などは省く） */
  const TARGET_POS = ['名詞']

  /** kuromoji.jsで該当プロパティの値が存在しない場合に設定されている値 */
  const NO_CONTENT = '*'

  // kuromoji.jsで形態素解析
  // 単語ごとの出現回数を出力
  return new Promise((resolve, reject) => {

    kuromoji.builder({ dicPath: DIC_URL }).build((err, tokenizer) => {
      if(err){
        return reject(err)
      }

      // 単語ごとの出現回数を出力
      const words = tokenizer.tokenize(text)
        .filter(t => TARGET_POS.includes(t.pos))
        .map(t => t.basic_form === NO_CONTENT ? t.surface_form : t.basic_form)
        .reduce((data, text) => {
          const upperText = text.toUpperCase()
          if (excludeWords.includes(upperText)) {
            return data
          }

          const target = data.find(c => c.text === upperText)

          if(target) {
            target.size = target.size + 1
            if(!target.rawTexts.includes(text)) {
              target.rawTexts.push(text)
            }
          } else {
            data.push({
              text: upperText,
              rawTexts: [ text ],
              size: 1,
            })
          }
          return data
        }, [])
        .map(data => {
          const almostSameText = data.rawTexts.map(text => {
              return {
                text,
                diff: countDiff(text, data.text),
              }
            })
            .reduce((a, b) => a.diff <= b.diff ? a : b) // 大文字に近いほうを採用する
            .text
          
          return {
            text: almostSameText,
            size: data.size,
          }
        })

      resolve(words)
    })
  })
}


function createWordCloud({ words, w, h, fontSizePow, fontSizeZoom, padding }) {

  // D3-Cloudによる解析
  return new Promise((resolve, reject) => {
    cloud().size([w, h])
      .canvas(() => createCanvas(w, h))
      .words(words)
      .rotate(word => word.size % 2 === 1 ? 0 : 90)
      .fontWeight(word => Math.pow(word.size, fontSizePow) * fontSizeZoom)
      .fontSize(word => Math.pow(word.size, fontSizePow) * fontSizeZoom)
      .font('meiryo')
      .padding(padding)
      .on('end', wordsForCloud => {

        resolve(wordsForCloud)
      })
      .start()
  })
  // d3.jsによる解析
  .then(wordsForCloud => {
    return new Promise((resolve, reject) => {
      /** 仮想DOM */
      const document = new JSDOM(`<body></body>`).window.document

      d3.select(document.body)
        .append('svg')
          .attr('class', 'ui fluid image')
          .attr('viewBox', `0 0 ${w} ${h}`)
          .attr('width', '100%')
          .attr('height', '100%')
        .append('g')
          .attr('transform', `translate(${w/2},${h/2})`)
        .selectAll('text')
          .data(wordsForCloud)
        .enter().append('text')
          .style('font-size', d => `${d.size}px`)
          .style('font-family', d => d.font)
          .attr('transform', d => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
          .style('fill', (d, i) => d3.schemeCategory10[i % 10])
          .attr('text-anchor', 'middle')
          .text(d => d.text)
      
      // 最終的にSVGの文字列を返す
      resolve(document.body.innerHTML)
    })
  })
}

function rawText(html) {
  return striptags(html, '<pre>').replace(/<pre[\s\S]+?>[\s\S]+?<\/pre>/g, '').trim();
}