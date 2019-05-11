import React from 'react';
import { Link } from 'gatsby'

import PostMetaInfo from '../post-meta-info';
import styles from './index.module.scss';
import * as config from '../../config/blog-config.js';



class PostPreview extends React.Component {
  render() {
    const {
      slug,
      title,
      excerpt,
      date,
      tags,
      thumbnail,
    } = this.props.postField;

    return (
      <article key={slug} className={styles.content}>
        <div className={styles.content_thumbnail}>
          <img className={styles.content_thumbnail_image} src={thumbnail || config.blogImageUrl} />
        </div>
        <div className={styles.content_post_info}>
          <h3 className={styles.title} >
            <Link className={styles.title_link} to={slug}>
              {title}
            </Link>
          </h3>
          <p className={styles.content_text} dangerouslySetInnerHTML={{ __html: excerpt }} />
          <PostMetaInfo
            tags={tags}
            date={date}
            />
        </div>
      </article>
    );
  }
}

export default PostPreview;