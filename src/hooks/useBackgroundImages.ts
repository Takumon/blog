import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

export default function useBackgroundImages() {
  return useStaticQuery(graphql`
    query BackgroundImages {
      headerImage: file(relativePath: { eq: "background.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 1500, quality: 100) {
            base64
            aspectRatio
            src
            srcSet
            srcWebp
            srcSetWebp
            sizes
          }
        }
      }
      footerImage: file(relativePath: { eq: "background-for-footer.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 1500, quality: 100) {
            base64
            aspectRatio
            src
            srcSet
            srcWebp
            srcSetWebp
            sizes
          }
        }
      }
      avatarImage: file(relativePath: { eq: "avatar.jpg" }) {
        childImageSharp {
          fluid(maxWidth: 280, quality: 100) {
            base64
            aspectRatio
            src
            srcSet
            srcWebp
            srcSetWebp
            sizes
          }
        }
      }
    }
  `)
}
