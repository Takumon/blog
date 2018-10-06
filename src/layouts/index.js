import '../css/base.scss';
import 'prismjs/themes/prism-solarizedlight.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

import React from 'react'
import Link from 'gatsby-link'


import {blogTitle} from '../config/blog-config.js';
import Seo from '../components/seo';
import Footer from '../components/footer';
import Bio from '../components/bio'


export default class Template extends React.Component {

  render() {
    const { location, children, data } = this.props

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
        <div className="headerContainer">
          <div className="headerContainer__inner">
            <h1 className="blogTitleArea">
              <Link
                className="blogTitle"
                to={'/'}
              >{blogTitle} </Link>
            </h1>
            <Bio />
          </div>
        </div>
      );
    } else if(isTag) {
      header = (
        <div className="headerContainer">
          <div className="headerContainer__inner">
            <h1 className="blogTitleArea">
              <Link
                className="blogTitle"
                to={'/'}
              >{blogTitle} </Link>
            </h1>
            <Bio />
          </div>
        </div>
      );
    } else {
      header = '';
    }


    return (
      <div className="rootContainer">
        {(() => {
            return isRoot ? <Seo isRoot={isRoot} /> : '';
        })}
        {header}
        {children()}
        <Footer isRoot={isRoot} />
      </div>
    )
  }
}


