import React from 'react'
import { graphql } from 'gatsby'

import Post from '../components/Post'

import 'katex/dist/katex.min.css'
import { BlogPostQueryQuery } from '../../types/graphql-types'

type Props = {
  pageContext: any
  data: BlogPostQueryQuery
}

const BlogPostTemplate: React.FC<Props> = ({ pageContext, data }) => {
  const { post } = data
  const siteTitle = pageContext.siteMetadata.title

  return (
    <Post fields={post?.fields} headings={post?.headingsDetail} html={post?.html} pageContext={pageContext} siteTitle={siteTitle} />
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostQuery($slug: String) {
    post: markdownRemark(fields: { slug: { eq: $slug } }) {
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
