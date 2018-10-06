import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons'

import PostList from '../components/post-list';


class TagTemplate extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allMarkdownRemark.edges')
    const totalCount = get(this, 'props.data.allMarkdownRemark.totalCount')


    const targetTag =  (
      <div style={{
            borderRight: '1px solid #ccc',
            borderBottom: '1px solid #ccc',
            borderLeft: '1px solid #ccc',
            borderTop: '1px solid #ccc',
            borderRadius: '0.5em 0 0.5em 0',
            padding: '0.05em 0.75em',
            marginRight: '0.5em',
            fontWeight: 'bold',
            fontSize: '0.75em',
          }}>{this.props.pathContext.tag}</div>
    );

    const tagSearchResult = (
      <div className="tag-search-result">
        <FontAwesomeIcon icon={faTags} style={{marginRight: '0.5em'}}/>
        {targetTag}
        {totalCount}件
      </div>
    );

    return (
      <div>
        <Helmet title={`${siteTitle} | ${this.props.pathContext.tag}`}/>
        {tagSearchResult}
        <PostList postEdges={posts}>
        </PostList>
      </div>
    );
  }
}

export default TagTemplate;

export const pageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          excerpt
          timeToRead
          frontmatter {
            date(formatString: "YYYY/MM/DD")
            title
            tags
          }
        }
      }
    }
  }
`;
