
import React from 'react';
import PostPreview from '../post-preview';

import styles from './index.module.scss';

class PostList extends React.Component {
  getPosts() {
    return this.props.posts.map(p => {
      return {
        path: p.node.fields.slug,
        tags: p.node.frontmatter.tags,
        cover: p.node.frontmatter.cover,
        title: p.node.frontmatter.title,
        date: p.node.frontmatter.date,
        excerpt: p.node.excerpt,
        timeToRead: p.node.timeToRead
      };
    })
  }

  render() {
    return (
      <div className={styles.content}>
        {this.getPosts().map(post => <PostPreview post={post}></PostPreview>)}
      </div>
    );
  }
}

export default PostList;