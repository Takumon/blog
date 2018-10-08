import React from 'react';
import Link from 'gatsby-link'

import styles from './index.module.scss';



class Tag extends React.Component {
  render() {
    const { value, count } = this.props;

    if (count) {
      return (
        <div key={value} className={styles.content}>
          <Link to={`/tags/${value}`} className={styles.link}>
            <div className={styles.tag_name}>{value}</div>
            <div className={styles.tag_count}>{count}</div>
          </Link>
        </div>
      );
    } else {
      return (
        <div key={value} className={styles.content}>
          <Link to={`/tags/${value}`} className={styles.link}>
            <div className={styles.tag_name}>{value}</div>
          </Link>
        </div>
      );
    }


  }
}

export default Tag;