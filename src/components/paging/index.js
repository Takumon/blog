
import React from 'react';
import { Link } from 'gatsby'

import styles from './index.module.scss';

class Paging extends React.Component {

  render() {
    const { previous, next } = this.props
    return (
    <div>
      <ul className={styles.to_prev_and_next}>
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

      <div className={styles.to_list}>
        <Link className={styles.link_to_list} to="/" rel="prev">
          <i className={styles.tomato_icon_1} ></i>
          <i className={styles.tomato_icon_2} ></i>
          記事一覧
          <i className={styles.tomato_icon_3} ></i>
          <i className={styles.tomato_icon_4} ></i>
        </Link>
      </div>
    </div>
    );
  }
}

export default Paging;