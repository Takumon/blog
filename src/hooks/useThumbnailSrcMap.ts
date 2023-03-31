import { useMemo } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { ThumbnailsForPostRelationQuery } from '../../types/graphql-types'

export default function useThumbnailSrcMap(): { [path: string]: string } {
  const data = useStaticQuery<ThumbnailsForPostRelationQuery>(graphql`
    query ThumbnailsForPostRelation {
      images: allFile(filter: { relativePath: { regex: "/^thumbnail/*/" } }) {
        edges {
          node {
            relativePath
            childImageSharp {
              fluid(maxWidth: 400, quality: 40, pngQuality: 40) {
                src
              }
            }
          }
        }
      }
    }
  `)

  const thumbnails = useMemo(() => {
    return data.images.edges.reduce((result, edge) => {
      return { ...result, ...{ [edge.node.relativePath]: edge.node.childImageSharp?.fluid?.src || '' } }
    }, {})
  }, [data.images.edges])

  return thumbnails
}
