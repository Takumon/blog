import React, { Fragment } from 'react';
import Link from 'gatsby-link';

import Bio from '../bio'
import config from '../../config/blog-config';
import styles from './index.module.scss';


export default function Footer({isRoot}) {
  const bio = isRoot
    ? ''
    : <Bio />


  return (
    <footer className={styles.content} role="contentinfo">
      <div className={styles.content__inner}>
        {bio}
        <h4 className={styles.title}>
          <Link className={styles.title__link} to='/'>
            {config.blogTitle}<i className={styles.tomato_icon} ></i>
          </Link>
        </h4>


        <div className="copyright">
          Copyright © 2018. {config.blogAuthor}
          <a
            href={config.blogRepositoryUrl}
            rel="noopener noreferrer"
            className={styles.github_icon}>
          </a>
        </div>
      </div>
    </footer>
  );
}

