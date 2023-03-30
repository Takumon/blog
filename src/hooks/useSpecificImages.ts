import { useStaticQuery, graphql } from 'gatsby'
import { IGatsbyImageData } from 'gatsby-plugin-image'

type ReturnValue = {
  headerImage: IGatsbyImageData
  footerImage: IGatsbyImageData
  avatarImage: IGatsbyImageData
}

export default function useSpecificImages(): ReturnValue {
  const data = useStaticQuery<GatsbyTypes.BackgroundImagesQueryQuery>(graphql`
    query BackgroundImagesQuery {
      headerImage: file(relativePath: { eq: "background.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 1500, quality: 100, layout: CONSTRAINED)
        }
      }
      footerImage: file(relativePath: { eq: "background-for-footer.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 1500, quality: 100, layout: CONSTRAINED)
        }
      }
      avatarImage: file(relativePath: { eq: "avatar.jpg" }) {
        childImageSharp {
          gatsbyImageData(width: 200, quality: 100, layout: CONSTRAINED)
        }
      }
    }
  `)

  return {
    headerImage: data.headerImage?.childImageSharp?.gatsbyImageData as IGatsbyImageData, // 必ず取得できるのでキャスト
    footerImage: data.footerImage?.childImageSharp?.gatsbyImageData as IGatsbyImageData, // 必ず取得できるのでキャスト
    avatarImage: data.avatarImage?.childImageSharp?.gatsbyImageData as IGatsbyImageData, // 必ず取得できるのでキャスト
  }
}
