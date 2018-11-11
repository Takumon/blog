import React from 'react'
import { graphql } from 'gatsby'
import { get } from 'lodash'

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

    return (
      <Layout location={this.props.location}>
        <Title />
        <PostList postFields={posts.map(post => post.node.fields)} />
        <TagList posts={posts} />
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
