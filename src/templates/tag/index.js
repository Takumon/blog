import React from 'react'
import { graphql } from 'gatsby';
import { get } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons'

import Layout from '../../components/layout';
import Title from '../../components/title';
import PostList from '../../components/post-list';
import Tag from '../../components/tag'
import styles from './index.module.scss';
import TagList from '../../components/tag-list';

class TagTemplate extends React.Component {

  render() {
    const posts = get(this, 'props.data.tagRelated.edges')
    const totalCount = get(this, 'props.data.tagRelated.totalCount', 0)
    const allPosts = get(this, 'props.data.all.edges')


    const targetTag =  <Tag value={this.props.pageContext.tag} />

    const tagSearchResult = (
      <div className={styles.tag_search_result}>
        <FontAwesomeIcon icon={faTags} className={styles.tag_icon}/>
        {targetTag}
        {totalCount}件
      </div>
    );

    let postList = <div className={styles.no_post}>指摘したタグの記事はありません。</div>;
    if (posts && posts.length > 0) {
      postList = <PostList posts={posts} / >;
    }

    return (
      <Layout location={this.props.location}>
        <div>
          <Title tag={this.props.pageContext.tag} />
          {tagSearchResult}
          {postList}
          <TagList posts={allPosts} />
        </div>
      </Layout>
    );
  }
}

export default TagTemplate;

export const pageQuery = graphql`
  query($tag: String) {
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
