import React, { Fragment } from 'react';
import Link from 'gatsby-link';

import githubSvg from '../svg/github.svg';
import Bio from '../components/Bio'
import { rhythm } from '../utils/typography'

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
          >Takumon blog</Link>
        </h4>


        <div className="copyright">Copyright © 2018. Takumon</div>
        <a href="https://github.com/Takumon/blog" rel="noopener noreferrer" style={{ boxShadow: 'none'}}>
            <i className="footer-icon-github" style={{
              backgroundImage: `url(${githubSvg})`,
            }}></i>
        </a>
      </div>
    </footer>
  );
}

