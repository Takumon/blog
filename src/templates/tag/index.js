import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons'

import PostList from '../../components/post-list';
import Tag from '../../components/tag'
import styles from './index.module.scss';

class TagTemplate extends React.Component {
  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.allMarkdownRemark.edges')
    const totalCount = get(this, 'props.data.allMarkdownRemark.totalCount', 0)


    const targetTag =  <Tag value={this.props.pathContext.tag} />

    const tagSearchResult = (
      <div className={styles.tag_search_result}>
        <FontAwesomeIcon icon={faTags} className={styles.tag_icon}/>
        {targetTag}
        {totalCount}件
      </div>
    );

    const postlist = (!posts || posts.length === 0)
        ? <div className={styles.no_post}>指摘したタグの記事はありません。</div>
        : <PostList postEdges={posts} / >;

    return (
      <div>
        <Helmet title={`${siteTitle} | ${this.props.pathContext.tag}`}/>
        {tagSearchResult}
        {postlist}
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
