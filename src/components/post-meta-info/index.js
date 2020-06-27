import React, { useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import Tag from '../tag'
import styles from './index.module.scss'
import config from '../../config/blog-config'



const PostMetaInfo = ({ tags, date, color }) => {
  const tagList = tags.map(tag => <Tag key={tag} value={tag} color={color}/>)
  const formattedDate  = useMemo(() => moment(date).format(config.dateFormat), [ date ])

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
  )
}

export default PostMetaInfo