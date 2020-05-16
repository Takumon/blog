import React from 'react'

import Layout from '../components/layout';
import Post from '../components/post';

import '../css/qiita-code-block.css';


const QiitaPostTemplate = ({ location, pageContext }) => {

  const { node: post } = pageContext
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

