import React from 'react'
import { graphql } from 'gatsby'
import { get } from 'lodash'
import _orderBy from 'lodash/orderBy'

import Layout from '../components/layout';
import PostList from '../components/post-list';
import TagList from '../components/tag-list';
import Title from '../components/title';

class BlogIndex extends React.Component {
  render() {

    // マージして降順で並び替え
    // gatsby-node.jsで2つのノードに共通のfieldsを追加しているため条件分岐なし
    const posts = [
      ...get(this, 'props.data.allMarkdownRemark.edges', []),
      ...get(this, 'props.data.allQiitaPost.edges', [])
    ].sort((a,b) => {
      const aDate = new Date(a.node.fields.date)
      const bDate = new Date(b.node.fields.date)

      if( aDate < bDate ) return 1
      if( aDate > bDate ) return -1
      return 0
    })


    let tagCounts = []

    posts.forEach(post => {
      post.node.fields.tags.forEach(t => {
        if ('Qiita' === t) {
          return
        }

        const targetData = tagCounts.find(data => data.text === t)
        if (targetData) {
          targetData.size = targetData.size + 1
        } else {
          tagCounts.push({
            text: t,
            size: 1,
          })
        }
      })
    })

    tagCounts = _orderBy(tagCounts, ['size', 'text'], ['desc', 'asc'])



    return (
      <Layout location={this.props.location}>
        <Title />
        <PostList postFields={posts.map(post => post.node.fields).slice(0,10)} />
        <TagList tagCounts={tagCounts} />
      </Layout>
    );
  }
}

export default BlogIndex

export const pageQuery = graphql`
  {
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
