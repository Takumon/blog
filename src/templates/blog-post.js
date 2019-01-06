import React from 'react'
import { graphql } from 'gatsby'
import { get } from 'lodash'

import config from '../config/blog-config';
import Layout from '../components/layout';
import Post from '../components/post';

import 'katex/dist/katex.min.css';

class BlogPostTemplate extends React.Component {


  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    return (
      <Layout location={this.props.location}>
        <Post
          fields={post.fields}
          headings={post.headingsDetail}
          html={post.html}
          pageContext={this.props.pageContext}
          siteTitle={siteTitle}
        />
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      headingsDetail {
        id
        value
        depth
        parents {
          id
          value
          depth
        }
      }
      fields {
        title
        excerpt
        date
        tags
        thumbnail
      }
    }
  }
`
