import React from 'react'

import Layout from '../components/layout';
import Post from '../components/post';

import '../css/qiita-code-block.css';


const QiitaPostTemplate = ({
  pageContext,
  location,
  data,
}) => {

  const { post } = data
  const siteTitle = pageContext.siteMetadata.title

  return ( 
    <Layout location={location}>
      <Post
        fields={post.fields}
        headings={post.headings}
        html={post.rendered_body}
        pageContext={pageContext}
        siteTitle={siteTitle}
      />
    </Layout>
  )
}

export default QiitaPostTemplate


export const pageQuery = graphql`
  query($slug: String) {
    post: qiitaPost(fields: { slug: { eq: $slug}}) {
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
`
