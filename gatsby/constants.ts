export const query = `
query GatsbyNodeQuery {
  site {
    siteMetadata {
      title
      author
    }
  }

  allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: 1000) {
    edges {
      node {
        html
        excerpt
        frontmatter {
          slug
          title
          date
          tags
          keywords
          thumbnail
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
          gatsbyImageData(
            width: 1200, 
            quality: 90,
            pngOptions: {
              quality: 90
            },
            layout: CONSTRAINED
          )
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
