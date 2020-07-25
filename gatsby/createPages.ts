import { CreatePagesArgs } from 'gatsby'
import path from 'path'
import _kebabCase from 'lodash/kebabCase'
import _flow from 'lodash/fp/flow'
import _forEach from 'lodash/fp/forEach'
import _uniq from 'lodash/fp/uniq'
import _flatMap from 'lodash/fp/flatMap'
import _orderBy from 'lodash/orderBy'
import { extractRelatedPosts, extractRelatedPostRankings } from './gatsby-related-post'
import { createWordCount, createWordCloud } from './wordCloud'

import striptags from 'striptags'

import config from '../src/config/blog-config.js'
import { POST_TYPE, query } from './constants'

import { TagData, WordCloudParam} from '../src/@types'
import type { QueryResult, PostNodeWrapper, PostNode, OriginalPostNode, QiitaPostNode, WordCounts, TempWordCounts } from './types'


// onCreateNodeより後に実行される
export const createPages = async ({ graphql, actions }: CreatePagesArgs) => {
  const { createPage } = actions

  const blogPost = path.resolve('./src/templates/blog-post.tsx')
  const qiitaPost = path.resolve('./src/templates/qiita-post.tsx')
  const tagPage = path.resolve('./src/templates/tags.tsx')
  const aboutPage = path.resolve('./src/templates/about.tsx')

  const result = await graphql<QueryResult>(query)
  const thumbnails = result.data?.thumbnails
  const siteMetadata = result.data?.site.siteMetadata

  // オリジナル記事とQiitaの記事を1つのリストにする
  const originalPosts: PostNodeWrapper[] = result.data?.allMarkdownRemark.edges.map(p => {
    return {
      type: POST_TYPE.ORIGINAL,
      date: new Date(p.node.fields.date),
      node: p.node,
    }
  })

  const qiitaPosts: PostNodeWrapper[] = result.data?.allQiitaPost.edges.map(p => {
    return {
      type: POST_TYPE.QIITA,
      date: new Date(p.node.fields.date),
      node: p.node,
    }
  })

  const posts: PostNodeWrapper[] = [...originalPosts, ...qiitaPosts].sort((a, b) => {
    if (a.date < b.date) return 1
    if (a.date > b.date) return -1
    return 0
  })

  const allPostNodes: PostNode[] = posts.map(p => p.node)

  const defaultThumbnail = thumbnails?.edges.find(edge => edge.node.relativePath.includes(config.defaultThumbnailImagePath))

  // 記事詳細ページ生成
  posts.forEach(({ type, node }: PostNodeWrapper, index: number) => {
    // 最大5つ関連記事を取得
    const relatedPosts = extractRelatedPosts(allPostNodes, node).slice(0, 5)
    const latestPosts = allPostNodes.slice(0, 5)

    if (type === POST_TYPE.ORIGINAL) {
      const thumbnail = thumbnails?.edges.find(edge => edge.node.relativePath.includes(node.fields.thumbnail))

      createPage({
        path: node.fields.slug,
        component: blogPost,
        context: {
          thumbnail,
          siteMetadata,
          slug: node.fields.slug,
          relatedPosts,
          latestPosts,
          ...prevNext(posts, index),
        },
      })
    } else if (type === POST_TYPE.QIITA) {
      createPage({
        path: node.fields.slug,
        component: qiitaPost,
        context: {
          thumbnail: defaultThumbnail,
          siteMetadata,
          slug: node.fields.slug,
          relatedPosts,
          latestPosts,
          ...prevNext(posts, index),
        },
      })
    } else {
      throw new Error(`Unexpected post type = ${type}`)
    }
  })

  // 記事関連情報生成
  const allPostRelationsForAboutPage = allPostNodes.map(node => {
    const simpleNode = {
      fields: node.fields,
    }

    return {
      node: simpleNode,
      relations: extractRelatedPostRankings(allPostNodes, node, { threshold: 50 }),
    }
  })

  // WordCloud用データ加工処理
  const allText = posts
    .map(({ type, node }) => {
      if (type === POST_TYPE.ORIGINAL) {
        const originalNode = node as OriginalPostNode
        return rawText(originalNode.html)
      } else {
        const qiitaNode = node as QiitaPostNode
        return rawText(qiitaNode.rendered_body)
      }
    })
    .join('\n')

  const tagData: TagData = []

  posts.forEach(post => {
    post.node.fields.tags.forEach(t => {
      if ('Qiita' === t) {
        return
      }

      const targetData = tagData.find(data => data.text === t)
      if (targetData) {
        targetData.size = targetData.size + 1
      } else {
        tagData.push({
          text: t,
          size: 1,
        })
      }
    })
  })

  // JSON使ってDeepコピーする
  const tagCounts = _orderBy(JSON.parse(JSON.stringify(tagData)), ['size', 'text'], ['desc', 'asc'])

  // WordCloud生成
  const paramForTag: WordCloudParam = {
    words: tagData,
    w: 1200,
    h: 630,
    fontSizePow: 0.8,
    fontSizeZoom: 18,
    padding: 2,
  }

  const tagSvg = await createWordCloud(paramForTag)
  const wordCloudData = await createWordCount(allText)

  const paramForText: WordCloudParam = {
    words: wordCloudData,
    w: 1200,
    h: 630,
    fontSizePow: 0.6,
    fontSizeZoom: 3.1,
    padding: 0.2,
  }

  const textSvg = await createWordCloud(paramForText)

  // 記事分析ページ生成
  createPage({
    path: '/about/',
    component: aboutPage,
    context: {
      allPostRelations: allPostRelationsForAboutPage,
      wordCloudText: textSvg,
      wordCloudTag: tagSvg,
    },
  })

  // タグ別一覧ページ生成
  _flow(
    _flatMap((post: PostNodeWrapper) => post.node.fields.tags),
    _uniq,
    _forEach((tag: string)=> {
      // ソートは省略する。postsはソート済だから。
      const nodes = posts.filter(post => post.node.fields.tags.includes(tag)).map(post => post.node)

      createPage({
        path: `/tags/${_kebabCase(tag)}/`,
        component: tagPage,
        context: {
          nodes,
          tag,
          tagCounts,
        },
      })
    })
  )(posts)
}

/**
 * 指定したインデックスの記事の前後の記事を取得する.
 *
 * @param {Array} posts 記事一覧
 * @param {int} index 対象記事のインデックス
 */
function prevNext(posts: PostNodeWrapper[], index: number) {
  return {
    previous: index === posts.length - 1 ? null : posts[index + 1].node,
    next: index === 0 ? null : posts[index - 1].node,
  }
}

function rawText(html: string) {
  return striptags(html, '<pre>')
    .replace(/<pre[\s\S]+?>[\s\S]+?<\/pre>/g, '')
    .trim()
}
