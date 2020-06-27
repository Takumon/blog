import React from 'react'
import { Link } from 'gatsby'
import { kebabCase } from 'lodash'

import styles from './index.module.scss'


const Tag = ({value, count, color}) => {

  return (
    <div key={value} className={styles.content}>
      <Link to={`/tags/${kebabCase(value)}`} className={styles.link}>
        <div className={styles.tag_name} style={{color: color}}>{value}</div>
        { count && <div className={styles.tag_count}>{count}</div> }
      </Link>
    </div>
  )
}

export default Tag