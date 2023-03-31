import { useStaticQuery, graphql } from 'gatsby'

export default function useRootThumbnailPath(): string {
  const data = useStaticQuery<GatsbyTypes.RootThumbnailPathQueryQuery>(graphql`
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
