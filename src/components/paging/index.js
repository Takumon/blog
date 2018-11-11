
import React from 'react';
import { Link } from 'gatsby'

import styles from './index.module.scss';

class Paging extends React.Component {

  render() {
    const { previous, next } = this.props
    return (
      <ul className={styles.content}>
        <li>
          {
            previous &&
            <Link className={styles.link_to_previous} to={previous.fields.slug} rel="prev">
              ← 古い記事<br/>{previous.fields.title}
            </Link>
          }
        </li>
        <li>
          {
            next &&
            <Link className={styles.link_to_next} to={next.fields.slug} rel="next">
              新しい記事 →<br/>
              {next.fields.title}
            </Link>
          }
        </li>
      </ul>
    );
  }
}

export default Paging;