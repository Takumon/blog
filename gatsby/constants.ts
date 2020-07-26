export const query = `
query GatsbyNodeQuery {
  site {
    siteMetadata {
      title
      author
    }
  }

  allMarkdownRemark(sort: { fields: [fields___date], order: DESC }, limit: 1000) {
    edges {
      node {
        html
        fields {
          slug
          title
          date
          excerpt
          tags
          keywords
          thumbnail
        }
      }
    }
  }


  allQiitaPost(sort: { fields: [fields___date], order: DESC }, limit: 1000) {
    edges {
      node {
        rendered_body
        fields {
          slug
          title
          date
          excerpt
          tags
          keywords
          thumbnail
        }
        user {
          id
          profile_image_url
          description
        }
      }
    }
  }


  thumbnails: allFile(filter: {relativePath: {regex: "/^thumbnail/*/"}}) {
    edges {
      node {
        relativePath
        name
        childImageSharp {
          fluid(maxWidth: 1200, quality: 90, pngQuality: 90) {
            base64
            aspectRatio
            src
            srcSet
            sizes
          }
        }
      }
    }
  }
}
`

export enum POST_TYPE {
  ORIGINAL = 'original',
  QIITA = 'qiita',
}
