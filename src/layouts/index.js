import '../css/base.scss';
import '../css/highlight.scss';
import 'prismjs/themes/prism-solarizedlight.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

import React from 'react'
import Link from 'gatsby-link'


import {blogTitle} from '../config/blog-config.js';
import Seo from '../components/seo';
import Footer from '../components/footer';
import Bio from '../components/Bio'


export default class Template extends React.Component {

  render() {
    const { location, children, data } = this.props

    let rootPath = `/`
    if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
      rootPath = __PATH_PREFIX__ + `/`
    }
    const isRoot = location.pathname === rootPath;

    const header = (
      <h1
        className="blogTitleArea"
      >
        <Link
          className="blogTitle"
          to={'/'}
        >{blogTitle}</Link>
      </h1>
    )


    return (
      <div className="rootContainer">
        {(() => {
            return isRoot ? <Seo isRoot={isRoot} /> : '';
        })}

        <div className="headerContainer">
          {header}
          <Bio />
        </div>

        <div className="childContainer">
          {children()}
        </div>
        <Footer isRoot={isRoot} />
      </div>
    )
  }
}


