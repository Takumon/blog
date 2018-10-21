import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import Tag from '../tag';
import styles from './index.module.scss';



class PostMetaInfo extends React.Component {
  render() {
    const { frontmatter, color } = this.props;
    const tagList = frontmatter.tags.map(tag => <Tag key={tag} value={tag} color={color}/>);

    return (
      <small className={styles.content} >
        <div className={styles.date} style={{color: color}}>
          <FontAwesomeIcon color={color} icon={faCalendarAlt} size="sm" />
          {frontmatter.date}
        </div>
        <div className={styles.tags}>
          <FontAwesomeIcon color={color} icon={faTags} size="sm"/>
          {tagList}
        </div>
      </small>
    );
  }
}

export default PostMetaInfo;