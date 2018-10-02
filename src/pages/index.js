import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

import { rhythm } from '../utils/typography'

class BlogIndex extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allMarkdownRemark.edges')


    return (
      <div>
        <Helmet title="siteTitle"/>
        {posts.map(({ node }) => {
          const title = get(node, 'frontmatter.title') || node.fields.slug
          const tags = node.frontmatter.tags.map(tag => <div style={{
            borderRight: '1px solid #ccc',
            borderBottom: '1px solid #ccc',
            borderLeft: '1px solid #ccc',
            borderTop: '1px solid #ccc',
            borderRadius: '0.5em 0 0.5em 0',
            padding: '0.05em 0.75em',
            marginRight: '0.5em',
            fontWeight: 'bold',
            fontSize: '0.75em',
          }}>{tag}</div>)

          return (
            <article key={node.fields.slug} className="articleListItem">
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{
                  boxShadow: 'none',
                  color: '#4a4a4a',
                  fontSize: '1.2em',
                  lineHeight: '1em',
                }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
              <small style={{
                        color: '#99a',
                        fontFamily: 'sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        margin: '-0.5em 0 2em' }}>
                <div style={{marginRight:'2em', fontSize: '1.1em'}}>
                  <FontAwesomeIcon icon={faCalendarAlt} style={{marginRight: '0.5em' }}/>
                  {node.frontmatter.date}
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <FontAwesomeIcon icon={faTags} style={{marginRight: '0.5em'}}/>
                  {tags}
                </div>
              </small>
            </article>
          )
        })}
      </div>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY/MM/DD")
            title
            tags
          }
        }
      }
    }
  }
`
