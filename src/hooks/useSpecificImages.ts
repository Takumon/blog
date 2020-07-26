import { useStaticQuery, graphql } from 'gatsby'
import type { FluidObject } from 'gatsby-image'
import { BackgroundImagesQueryQuery } from '../../types/graphql-types'

type Factor = FluidObject | null | undefined 
type ReturnValue = {
  headerImage: Factor,
  footerImage: Factor,
  avatarImage: Factor,
}

export default function useSpecificImages(): ReturnValue {
  const data = useStaticQuery<BackgroundImagesQueryQuery>(graphql`
    query BackgroundImagesQuery {
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

  return {
    headerImage: data.headerImage?.childImageSharp?.fluid as FluidObject,
    footerImage: data.footerImage?.childImageSharp?.fluid as FluidObject,
    avatarImage: data.avatarImage?.childImageSharp?.fluid as FluidObject,
  }
}
