import { CreatePagesArgs } from 'gatsby'
import path from 'path'
import _kebabCase from 'lodash/kebabCase'
import _flow from 'lodash/fp/flow'
import _forEach from 'lodash/fp/forEach'
import _uniq from 'lodash/fp/uniq'
import _flatMap from 'lodash/fp/flatMap'
import _orderBy from 'lodash/orderBy'
import striptags from 'striptags'

import { extractRelatedPosts } from './gatsby-related-post'
import { POST_TYPE, query } from './constants'
import type { TagData, QueryResult, PostNodeWrapper, PageContextTags, PageContextPost } from '../src/@types'

// onCreateNodeより後に実行される
export const createPages = async ({ graphql, actions }: CreatePagesArgs): Promise<void> => {
  const { createPage } = actions

  const BlogPostTemplate = path.resolve('./src/templates/BlogPostTemplate.tsx')
  const TagsTemplate = path.resolve('./src/templates/TagsTemplate.tsx')

  const result = await graphql<QueryResult>(query)
  if (!result.data) return

  const thumbnails = result.data.thumbnails
  const siteMetadata = result.data.site.siteMetadata

  const posts: PostNodeWrapper[] = result.data?.allMarkdownRemark.edges.map((p) => {
    return {
      type: POST_TYPE.ORIGINAL,
      date: new Date(p.node.frontmatter.date),
      node: p.node,
    }
  })

  const allPostNodes: GatsbyTypes.MarkdownRemark[] = posts.map((p) => p.node)

  // 記事詳細ページ生成
  posts.forEach(({ type, node }: PostNodeWrapper, index: number) => {
    // 最大5つ関連記事を取得
    const relatedPosts = extractRelatedPosts(allPostNodes, node).slice(0, 5)
    const latestPosts = allPostNodes.slice(0, 5)

    if (type === POST_TYPE.ORIGINAL) {
      const thumbnail = thumbnails?.edges.find((edge) => edge.node.relativePath.includes(node.frontmatter.thumbnail))

      const pageContextPost: PageContextPost = {
        thumbnail,
        siteMetadata,
        slug: node.frontmatter.slug,
        relatedPosts,
        latestPosts,
        ...prevNext(posts, index),
      }

      createPage({
        path: node.frontmatter.slug,
        component: BlogPostTemplate,
        context: pageContextPost,
      })
    } else {
      throw new Error(`Unexpected post type = ${type}`)
    }
  })

  const tagData: TagData = []

  posts.forEach((post) => {
    post.node.frontmatter.tags.forEach((t) => {
      if ('Qiita' === t) {
        return
      }

      const targetData = tagData.find((data) => data.text === t)
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

  // タグ別一覧ページ生成
  _flow(
    _flatMap((post: PostNodeWrapper) => post.node.frontmatter.tags),
    _uniq,
    _forEach((tag: string) => {
      // ソートは省略する。postsはソート済だから。
      const nodes = posts.filter((post) => post.node.frontmatter.tags.includes(tag)).map((post) => post.node)

      const pageContextTag: PageContextTags = {
        nodes,
        tag,
        tagCounts,
      }
      createPage({
        path: `/tags/${_kebabCase(tag)}/`,
        component: TagsTemplate,
        context: pageContextTag,
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
function prevNext(
  posts: PostNodeWrapper[],
  index: number
): {
  previous: GatsbyTypes.MarkdownRemark | null
  next: GatsbyTypes.MarkdownRemark | null
} {
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
