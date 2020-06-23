import React, { Fragment } from 'react';
import { Link, useStaticQuery } from 'gatsby';
import BackgroundImage from 'gatsby-background-image'

import Bio from '../bio'
import config from '../../config/blog-config';
import styles from './index.module.scss';

export default function Footer({isRoot}) {
  const bio = isRoot
    ? ''
    : <Bio />


  const {
    footerImage
  } = useStaticQuery(graphql`
    query {
      footerImage: file(relativePath: {eq: "background-for-footer.jpg"}) {
        childImageSharp {
          fluid(maxWidth: 1200, quality: 80, pngQuality: 80) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `)

  const imageData = footerImage.childImageSharp.fluid
  

  return (
    <BackgroundImage
      Tag="footer"
      role="contentinfo"
      className={styles.content}
      fluid={imageData}
    >
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
            aria-label="blog_repository"
            href={config.blogRepositoryUrl}
            rel="noopener noreferrer"
            className={styles.github_icon}>
          </a>
        </div>
      </div>
    </BackgroundImage>
  );
}

