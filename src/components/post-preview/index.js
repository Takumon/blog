import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import Link from 'gatsby-link'
import Tag from '../tag';
import PostMetaInfo from '../post-meta-info';
import styles from './index.module.scss';



class PostPreview extends React.Component {
  render() {
    const post = this.props.post;

    return (
      <article key={post.path} className={styles.content}>
        <h3 className={styles.title} >
          <Link className={styles.title_link} to={post.path}>
            {post.title}
          </Link>
        </h3>
        <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        <PostMetaInfo post={post} />
      </article>
    );
  }
}

export default PostPreview;