import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'


export default ({
  filename,
  alt,
}) => (
  <StaticQuery
    query={graphql`
      query {
        images: allFile(filter: {relativePath: {regex: "/^thumbnail/*/"}}) {
          edges {
            node {
              relativePath
              name
              childImageSharp {
                fluid(maxWidth: 1200, quality: 90, pngQuality: 90) {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        }
      }
    `}

    render={(data) => {
      const image = data.images.edges.find(n =>
        n.node.relativePath.includes(filename)
      )

      if (!image) {
        return null
      }

      return <Img alt={alt} fluid={image.node.childImageSharp.fluid} />
    }}
  />
)