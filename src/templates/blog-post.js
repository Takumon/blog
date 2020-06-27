import React from 'react'

import Layout from '../components/layout';
import Post from '../components/post';

import 'katex/dist/katex.min.css';

const BlogPostTemplate = ({
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
        headings={post.headingsDetail}
        html={post.html}
        pageContext={pageContext}
        siteTitle={siteTitle}
      />
    </Layout>
  )
}

export default BlogPostTemplate


export const pageQuery = graphql`
  query($slug: String) {
    post: markdownRemark(fields: { slug: { eq: $slug}}) {
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
