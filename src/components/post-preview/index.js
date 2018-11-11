import React from 'react';
import { Link } from 'gatsby'

import PostMetaInfo from '../post-meta-info';
import styles from './index.module.scss';



class PostPreview extends React.Component {
  render() {
    const {slug, title, excerpt, date, tags} = this.props.postField;

    return (
      <article key={slug} className={styles.content}>
        <h3 className={styles.title} >
          <Link className={styles.title_link} to={slug}>
            {title}
          </Link>
        </h3>
        <p dangerouslySetInnerHTML={{ __html: excerpt }} />
        <PostMetaInfo
          tags={tags}
          date={date}
          />
      </article>
    );
  }
}

export default PostPreview;