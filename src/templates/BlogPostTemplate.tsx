import React from 'react'
import { graphql } from 'gatsby'

import Post from '../components/Post'

import 'katex/dist/katex.min.css'

type Props = {
  pageContext: any
  data: {
    post: GatsbyTypes.MarkdownRemark & { headingsDetail: any }
  }
}

const BlogPostTemplate: React.FC<Props> = ({ pageContext, data }) => (
  <Post item={data.post} headings={data.post.headingsDetail} pageContext={pageContext} siteTitle={pageContext.siteMetadata.title} />
)

export default BlogPostTemplate

export const pageQuery = graphql`
  query ($slug: String) {
    post: markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      excerpt
      frontmatter {
        slug
        title
        date
        tags
        keywords
        thumbnail
      }
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
    }
  }
`
