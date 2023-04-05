import { useStaticQuery, graphql } from 'gatsby'

export default function useTitle(): string {
  const data = useStaticQuery<GatsbyTypes.LayoutQueryQuery>(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return data.site?.siteMetadata?.title || ''
}
