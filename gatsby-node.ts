import { GatsbyNode } from "gatsby"

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({ actions }) => {
  actions.createTypes(`
    type MarkdownRemark implements Node {
      excerpt: String!
      frontmatter: Frontmatter!
    }

    type Frontmatter  {
      slug: String!
      title: String!
      date: Date!
      tags: [String!]!
      keywords: [String!]!
      thumbnail: String!
    }
  `)
}