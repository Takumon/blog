import React from 'react'
import { graphql } from 'gatsby'
import { get } from 'lodash'

import config from '../config/blog-config';
import Layout from '../components/layout';
import Post from '../components/post';

import '../css/qiita-code-block.css';


class QiitaPostTemplate extends React.Component {

  render() {
    const post = this.props.data.qiitaPost
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    return (
      <Layout location={this.props.location}>
        <Post
          fields={post.fields}
          headings={post.headings}
          html={post.rendered_body}
          pageContext={this.props.pageContext}
          siteTitle={siteTitle}
        />
      </Layout>
    )
  }
}

export default QiitaPostTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    qiitaPost(fields: { slug: { eq: $slug } }) {
      rendered_body
      headings {
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
      }
      user {
        id
        profile_image_url
        description
      }
    }
  }
`
