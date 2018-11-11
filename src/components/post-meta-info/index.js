import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';

import Tag from '../tag';
import styles from './index.module.scss';
import config from '../../config/blog-config'



class PostMetaInfo extends React.Component {
  render() {
    const { tags, date, color } = this.props;
    const tagList = tags.map(tag => <Tag key={tag} value={tag} color={color}/>);
    const formattedDate  = moment(date).format(config.dateFormat)

    return (
      <small className={styles.content} >
        <div className={styles.date} style={{color: color}}>
          <FontAwesomeIcon color={color} icon={faCalendarAlt} size="sm" />
          {formattedDate}
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