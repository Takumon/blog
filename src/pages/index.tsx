import React, { useMemo } from 'react'
import { graphql } from 'gatsby'
import _orderBy from 'lodash/orderBy'
import type { TagCounts } from '../@types'
import type { IndexPageQuery } from '../../types/graphql-types'
import Layout from '../components/layout'
import PostList from '../components/post-list'
import TagList from '../components/tag-list'
import Title from '../components/Title'




type Props = {
  location: any
  data: IndexPageQuery
}
const BlogIndex: React.FC<Props> = ({ location, data }) => {
  // マージして降順で並び替え
  // gatsby-node.jsで2つのノードに共通のfieldsを追加しているため条件分岐なし
  const posts = useMemo(
    () => {
      return [...data.allMarkdownRemark.edges, ...data.allQiitaPost.edges].sort((a, b) => {
        const aDate = new Date(a.node.fields?.date)
        const bDate = new Date(b.node.fields?.date)

        if (aDate < bDate) return 1
        if (aDate > bDate) return -1
        return 0
      })
    },
    [data]
  )

  const tagCounts = useMemo(
    () => {
      const _result:TagCounts = []

      posts.forEach(post => {
        post.node.fields?.tags?.forEach(t => {
          if (!t) {
            return
          }

          if ('Qiita' === t) {
            return
          }

          const targetData = _result.find(data => data.text === t)
          if (targetData) {
            targetData.size = targetData.size + 1
          } else {
            _result.push({
              text: t,
              size: 1,
            })
          }
        })
      })

      return _orderBy(_result, ['size', 'text'], ['desc', 'asc'])
    },
    [posts]
  )

  const postFields = useMemo(() => posts.map(post => post.node.fields), [posts])

  return (
    <Layout location={location}>
      <Title />
      <PostList postFields={postFields} />
      <TagList tagCounts={tagCounts} />
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexPage {
    allMarkdownRemark(sort: { fields: [fields___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
            title
            excerpt
            date
            tags
            thumbnail
          }
        }
      }
    }
    allQiitaPost(sort: { fields: [fields___date], order: DESC }) {
      edges {
        node {
          fields {
            slug
            title
            excerpt
            date
            tags
          }
        }
      }
    }
  }
`
