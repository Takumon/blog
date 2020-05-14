import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRss } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'gatsby'

import config from '../../config/blog-config'
import styles from './index.module.scss'


const Rss = ({ isAbout }) => (
  <div className={styles.content}>

    {isAbout
      ? (
        <Link to={`/`} aria-label="blog_toppage" className={styles.link_button} >
          Top Page
        </Link>
      )
      : (
        <Link to={`/about`} aria-label="blog_about" className={styles.link_button} >
          About
        </Link>
      )
    }

    <a
      aria-label="feedly"
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
      aria-label="rss"
      className={styles.button}
      href={config.blogRssUrl}
      target='blank'>
      <FontAwesomeIcon icon={faRss} />
    </a>
  </div>
)

export default Rss