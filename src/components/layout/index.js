import React from 'react'
import { Link } from 'gatsby'

import '../../css/base.scss';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

import styles from './index.module.scss';
import config from '../../config/blog-config';
import Seo from '../seo';
import Footer from '../footer';
import Bio from '../bio';
import Rss from '../rss';


export default class Layout extends React.Component {

  render() {
    const { location, children } = this.props

    let rootPath = `/`;
    if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
      rootPath = __PATH_PREFIX__ + rootPath;
    }
    let tagPath = `/tags/`;
    if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
      tagPath = __PATH_PREFIX__ + tagPath;
    }
    const isRoot = location.pathname === rootPath;
    const isTag = location.pathname.startsWith(tagPath);

    let header;

    if (isRoot) {
      header = (
        <div className={styles.header_container}>
          <Seo isRoot={true} />
          <div className={styles.header_container__inner}>
            <h1 className={styles.blog_title_area}>
              <Link
                className={styles.blog_title}
                to={'/'}
              >{config.blogTitle} </Link>
            </h1>
            <Bio />
          </div>
          <Rss />
        </div>
      );
    } else if(isTag) {
      header = (
        <div className={styles.header_container}>
         <Seo isRoot={true} />
         <div className={styles.header_container__inner}>
            <h1 className={styles.blog_title_area}>
              <Link
                className={styles.blog_title}
                to={'/'}
              >{config.blogTitle} </Link>
            </h1>
            <Bio />
          </div>
          <Rss />
        </div>
      );
    } else {
      header = '';
    }


    return (
      <div className={styles.root_container}>
        {header}
        {children}
        <Footer isRoot={isRoot} />
      </div>
    )
  }
}


