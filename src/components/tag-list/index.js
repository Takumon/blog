import React from 'react'
import _get from 'lodash/get'
import _flatMap from 'lodash/flatMap'
import _countBy from 'lodash/countBy'
import _orderBy from 'lodash/orderBy'
import _map from 'lodash/map'




import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons'

import Tag from '../tag';
import styles from './index.module.scss';

const TagList = ({ tagCounts }) => {
  return (
  <div className={styles.content}>
    <h3 className={styles.title}><FontAwesomeIcon icon={faTags} className={styles.title__icon}/>タグ一覧</h3>
    <div className={styles.list}>
      {tagCounts.map(t => <Tag key={t.text} value={t.text} count={t.size} />)}
    </div>
  </div>
  )
};

export default TagList;
