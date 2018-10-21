import React from 'react'
import { get, countBy, forEach, flatten, orderBy }from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons'

import Tag from '../tag';
import styles from './index.module.scss';

class TagList extends React.Component {
  render() {

    const tags = this.props.posts.map(p => get(p, 'node.frontmatter.tags', []));

    const tagCount = countBy(flatten(tags));

    let formatted = [];
    forEach(tagCount, (tag_count, tag_name) => {
      formatted.push({
        name: tag_name,
        count: tag_count
      });
    })
    const ordered = orderBy(formatted, ['count', 'name'], ['desc', 'asc']);

    return (
      <div className={styles.content}>
        <h4 className={styles.title}><FontAwesomeIcon icon={faTags} className={styles.title__icon}/>タグ一覧</h4>
        <div className={styles.list}>
          {ordered.map(t => <Tag key={t.name} value={t.name} count={t.count} />)}
        </div>
      </div>
    );
  }
}



export default TagList;
