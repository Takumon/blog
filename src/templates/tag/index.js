import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons'

import PostList from '../../components/post-list';
import Tag from '../../components/tag'
import styles from './index.module.scss';
import TagList from '../../components/tag-list';

class TagTemplate extends React.Component {

  render() {
    const siteTitle = get(this, 'props.data.site.siteMetadata.title')
    const posts = get(this, 'props.data.tagRelated.edges')
    const totalCount = get(this, 'props.data.tagRelated.totalCount', 0)
    const allPosts = get(this, 'props.data.all.edges')


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
        : <PostList posts={posts} / >;

    return (
      <div>
        <Helmet title={`${siteTitle} | ${this.props.pathContext.tag}`}/>
        {tagSearchResult}
        {postlist}
        <TagList posts={allPosts} />
      </div>
    );
  }
}

export default TagTemplate;

export const pageQuery = graphql`
  query TagPageQuery($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    all: allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            tags
          }
        }
      }
    }
    tagRelated: allMarkdownRemark(
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
