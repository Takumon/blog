import React from 'react';
import { Link } from 'gatsby'

import PostMetaInfo from '../post-meta-info';
import Image from '../image';
import styles from './index.module.scss';
import * as config from '../../config/blog-config.js';



class PostPreviewSmall extends React.Component {
  render() {
    const {
      slug, 
      title, 
      excerpt, 
      date, 
      tags,
      thumbnail,
    } = this.props.postField;


    const thumbnailArea = thumbnail
      ? <Image
          className={styles.content_thumbnail_image}
          filename={thumbnail}
          alt={'thumbnail'}
        />
      : <img
          className={styles.content_thumbnail_image}
          src={config.blogImageUrl}
          alt={'thumbnail'}
        />

    return (
      <Link key={slug} className={styles.content_link} to={slug}>
        <div className={styles.content_thumbnail}>
          {thumbnailArea}
        </div>
        <div className={styles.content_post_info}>
          <h3 className={styles.title} >
            {title}
          </h3>
          <div className={styles.post_meta_info}>
            <PostMetaInfo
              tags={tags}
              date={date}
              />
          </div>
        </div> 
      </Link>
    );
  }
}

export default PostPreviewSmall;