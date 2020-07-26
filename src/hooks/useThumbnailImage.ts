import { useMemo } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import type { FluidObject } from 'gatsby-image'
import { ThumbnailImagesQuery } from '../../types/graphql-types'

type Value = FluidObject | null | undefined 

export default function useThumbnailImage(filename: string): Value {
  const data = useStaticQuery<ThumbnailImagesQuery>(graphql`
    query ThumbnailImages {
      images: allFile(filter: { relativePath: { regex: "/^thumbnail/*/" } }) {
        edges {
          node {
            relativePath
            name
            childImageSharp {
              fluid(maxWidth: 800, quality: 50, pngQuality: 50) {
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
      }
    }
  `)

  const edges = data.images.edges
  const targetFluid= useMemo(
    () => {
      const e = edges.find(n => n.node.relativePath.includes(filename))
      return e?.node?.childImageSharp?.fluid
    },
    [edges, filename]
  )

  return targetFluid as FluidObject
}
