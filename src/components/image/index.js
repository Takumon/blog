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
        images: allFile {
          edges {
            node {
              relativePath
              name
              childImageSharp {
                sizes(maxWidth: 800) {
                  ...GatsbyImageSharpSizes
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

      const imageSizes = image.node.childImageSharp.sizes
      return (
        <Img
          alt={alt}
          sizes={imageSizes}
        />
      );
    }}
  />
)