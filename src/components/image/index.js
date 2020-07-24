import React, { useMemo } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

const Image = ({ filename, alt }) => {
  const edges = useStaticQuery(graphql`
    query {
      images: allFile(filter: { relativePath: { regex: "/^thumbnail/*/" } }) {
        edges {
          node {
            relativePath
            name
            childImageSharp {
              fluid(maxWidth: 800, quality: 50, pngQuality: 50) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
    }
  `).images.edges

  const image = useMemo(() => edges.find(n => n.node.relativePath.includes(filename)), [edges, filename])

  return image ? <Img alt={alt} fluid={image.node.childImageSharp.fluid} /> : null
}

export default Image
