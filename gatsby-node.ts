import { GatsbyNode } from "gatsby"

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({ actions }) => {
  actions.createTypes(`
    type MarkdownRemark implements Node {
      excerpt: String!
      html: String!
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

exports.createPages = require('./gatsby/createPages').createPages
