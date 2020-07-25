import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/free-solid-svg-icons'
import { TagCounts } from '../../@types'

import Tag from '../Tag'
import styles from './index.module.scss'

type Props = {
  tagCounts: TagCounts
}

// eslint-disable-next-line react/prop-types
const TagList: React.FC<Props> = ({ tagCounts }) => {
  return (
    <div className={styles.content}>
      <h3 className={styles.title}>
        <FontAwesomeIcon icon={faTags} className={styles.title__icon} />
        タグ一覧
      </h3>
      <div className={styles.list}>
        {tagCounts.map(t => (
          <Tag key={t.text} value={t.text} count={t.size} />
        ))}
      </div>
    </div>
  )
}

export default TagList
