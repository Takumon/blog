import React from 'react';
import { Link } from 'gatsby'

import PostMetaInfo from '../post-meta-info';
import styles from './index.module.scss';



class PostPreviewSmall extends React.Component {
  render() {
    const {slug, title, excerpt, date, tags} = this.props.postField;

    return (
      <Link key={slug} className={styles.content_link} to={slug}>
        <h3 className={styles.title} >
            {title}
        </h3>
        <PostMetaInfo
          tags={tags}
          date={date}
          />
      </Link>
    );
  }
}

export default PostPreviewSmall;