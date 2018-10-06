import React from 'react';
import Link from 'gatsby-link'

import styles from './index.module.scss';



class Tag extends React.Component {
  render() {
    const value = this.props.value;
    return (
      <div key={value} className={styles.content}>
        <Link to={`/tags/${value}`} className={styles.link}>
          {value}
        </Link>
      </div>
    );
  }
}

export default Tag;