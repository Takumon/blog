import { useStaticQuery, graphql } from 'gatsby'
import { LayoutQueryQuery } from '../../types/graphql-types'

export default function useTitle(): string {
  const data = useStaticQuery<LayoutQueryQuery>(graphql`
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
