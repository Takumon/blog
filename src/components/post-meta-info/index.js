import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import Tag from '../tag';
import styles from './index.module.scss';



class PostMetaInfo extends React.Component {
  render() {
    const post = this.props.post;
    const tagList = post.tags.map(tag => <Tag value={tag} />);

    return (
      <small className={styles.content} >
        <div className={styles.date}>
          <FontAwesomeIcon icon={faCalendarAlt}/>
          {post.date}
        </div>
        <div className={styles.tags}>
          <FontAwesomeIcon icon={faTags}/>
          {tagList}
        </div>
      </small>
    );
  }
}

export default PostMetaInfo;