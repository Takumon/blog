import { useMemo } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { IGatsbyImageData } from 'gatsby-plugin-image'

type Value = IGatsbyImageData | undefined

export default function useThumbnailImage(filename: string): Value {
  const data = useStaticQuery<GatsbyTypes.ThumbnailImagesQuery>(graphql`
    query ThumbnailImages {
      images: allFile(filter: { relativePath: { regex: "/^thumbnail/*/" } }) {
        edges {
          node {
            relativePath
            name
            childImageSharp {
              gatsbyImageData(width: 800, quality: 50, pngOptions: { quality: 50 }, layout: CONSTRAINED)
            }
          }
        }
      }
    }
  `)

  const edges = data.images.edges
  const targetFluid = useMemo(() => {
    const e = edges.find((n) => n.node.relativePath.includes(filename))
    return e?.node?.childImageSharp?.gatsbyImageData
  }, [edges, filename])

  return targetFluid
}
