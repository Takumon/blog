import React, { Fragment } from 'react';
import Link from 'gatsby-link';

import githubSvg from '../images/github.svg';
import tomatoSvg from '../images/tomato.svg';
import Bio from '../components/Bio'
import { blogTitle, blogAuthor, blogRepositoryUrl } from '../config/blog-config';

export default function Footer({isRoot}) {
  const bio = isRoot
    ? ''
    : <Bio />


  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        {bio}
        <h4 className="footer__title">
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              color: 'inherit',
            }}
            to='/'
          >{blogTitle}<i className="footer-icon-github" style={{
              backgroundImage: `url(${tomatoSvg})`,
              width: '1em',
              height: '1em',
              backgroundRepeat: 'no-repeat',
              margin: '0 0 0.3em 0.2em',
            }}></i></Link>
        </h4>


        <div className="copyright">Copyright © 2018. {blogAuthor}</div>
        <a href={blogRepositoryUrl} rel="noopener noreferrer" style={{ boxShadow: 'none'}}>
            <i className="footer-icon-github" style={{
              backgroundImage: `url(${githubSvg})`,
            }}></i>
        </a>
      </div>
    </footer>
  );
}

