import React from 'react';
import { Link } from 'gatsby'

import PostMetaInfo from '../post-meta-info';
import Image from '../image';
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
        <Link className={styles.title_link} to={slug}>
          <div className={styles.content_thumbnail}>
            <Image
              className={styles.content_thumbnail_image}
              filename={thumbnail || config.defaultThumbnailImagePath}
              alt={'thumbnail'}
            />
          </div>
          <div className={styles.content_post_info}>
            <h3 className={styles.title} >
                {title}
            </h3>
            <p
              className={styles.content_text}
              dangerouslySetInnerHTML={{ __html: excerpt }}
            />
            <PostMetaInfo
              tags={tags}
              date={date}
              />
          </div>
        </Link>
      </article>
    );
  }
}

export default PostPreview;