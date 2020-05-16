import React from 'react'

import Layout from '../components/layout';
import Post from '../components/post';

import 'katex/dist/katex.min.css';

const BlogPostTemplate = ({ pageContext, location }) => {

  const { node: post } = pageContext
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
