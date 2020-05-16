import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons'

import Layout from '../components/layout';
import Title from '../components/title';
import PostList from '../components/post-list';
import Tag from '../components/tag'
import styles from './tags.module.scss';
import TagList from '../components/tag-list';

const TagsTemplate = ({ location, pageContext }) => {

  const posts = pageContext.nodes
  const totalCount =
    posts && posts.length
      ? posts.length
      : 0

  const targetTag =  <Tag value={pageContext.tag} />

  const tagSearchResult = (
    <div className={styles.tag_search_result}>
      <FontAwesomeIcon icon={faTags} className={styles.tag_icon}/>
      {targetTag}
      {totalCount}件
    </div>
  );

  const postList =
    totalCount > 0
      ? <PostList postFields={posts.map(node => node.fields)} />
      : <div className={styles.no_post}>指摘したタグの記事はありません。</div>


  return (
    <Layout location={location}>
      <div>
        <Title tag={pageContext.tag} />
        {tagSearchResult}
        {postList}
      <TagList tagCounts={pageContext.tagCounts} />
      </div>
    </Layout>
  );
}

export default TagsTemplate;

