import { useStaticQuery, graphql } from 'gatsby'
import { RootThumbnailPathQueryQuery } from '../../types/graphql-types'

export default function useRootThumbnailPath(): string {
  const data = useStaticQuery<RootThumbnailPathQueryQuery>(graphql`
    query RootThumbnailPathQuery {
      file(relativePath: { eq: "thumbnail/for-root-page.png" }) {
        childImageSharp {
          resize(width: 1200, quality: 90) {
            src
          }
        }
      }
    }
  `)

  return data?.file?.childImageSharp?.resize?.src || ''
}