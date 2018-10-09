import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRss } from '@fortawesome/free-solid-svg-icons'

import config from '../../config/blog-config';
import styles from './index.module.scss';


class Rss extends React.Component {
  render() {
    return (
      <div className={styles.content}>
          <a
            className={styles.button}
            href='https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Ftakumon.com%2Frss.xml'
            target='blank'>
            <img
              id='feedlyFollow'
              src='https://s3.feedly.com/img/follows/feedly-follow-logo-green_2x.png'
              alt='follow us in feedly'
              width='36'
              height='36' />
          </a>
          <a
            className={styles.button}
            href={config.blogRssUrl}
            target='blank'>
            <FontAwesomeIcon icon={faRss} />
          </a>
        </div>
    );


  }
}

export default Rss;