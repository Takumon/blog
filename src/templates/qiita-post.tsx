import React from 'react'
import { graphql } from 'gatsby'

import Layout from '../components/layout'
import Post from '../components/post'
import '../css/qiita-code-block.css'

import { QiitaPostQuery } from '../../types/graphql-types.d'

type Props = {
  pageContext: any
  location: any
  data: QiitaPostQuery
}

const QiitaPostTemplate: React.FC<Props> = ({ pageContext, location, data }) => {
  const siteTitle = pageContext.siteMetadata.title

  return (
    <Layout location={location}>
      <Post fields={data.post?.fields} headings={data.post?.headings} html={data.post?.rendered_body} pageContext={pageContext} siteTitle={siteTitle} />
    </Layout>
  )
}

export default QiitaPostTemplate

export const pageQuery = graphql`
  query QiitaPost($slug: String) {
    post: qiitaPost(fields: { slug: { eq: $slug } }) {
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
