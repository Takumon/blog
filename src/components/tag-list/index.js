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

class TagList extends React.Component {
  render() {

    const {
      posts
    } = this.props

    let tagCounts = _flatMap(posts, p => _get(p, 'node.fields.tags', []))
    tagCounts = _map(_countBy(tagCounts), (value, key) => {
      return {
        name: key,
        count: value,
      }
    }),
    tagCounts = _orderBy(tagCounts, ['count', 'name'], ['desc', 'asc'])

    return (
      <div className={styles.content}>
        <h4 className={styles.title}><FontAwesomeIcon icon={faTags} className={styles.title__icon}/>タグ一覧</h4>
        <div className={styles.list}>
          {tagCounts.map(t => <Tag key={t.name} value={t.name} count={t.count} />)}
        </div>
      </div>
    );
  }
}



export default TagList;
