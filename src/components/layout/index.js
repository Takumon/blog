import React, { useMemo } from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import BackgroundImage from 'gatsby-background-image'

import '../../css/base.scss';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

import styles from './index.module.scss';
import config from '../../config/blog-config';
import Seo from '../seo';
import Footer from '../footer';
import Bio from '../bio';
import Rss from '../rss';
import UserHeat from '../user-heat';
import useBackgroundImages from '../background-image'


const useRootThumbnailPath = () => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: {eq: "thumbnail/for-root-page.png"}) {
        childImageSharp {
          resize(width: 1200, quality: 90) {
            src
          }
        }
      }
    }
  `)

  return data.file.childImageSharp.resize.src
}


const Layout = ({ location, children }) => {

  let rootPath = `/`;
  if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
    rootPath = __PATH_PREFIX__ + rootPath;
  }
  let tagPath = `/tags/`;
  if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
    tagPath = __PATH_PREFIX__ + tagPath;
  }

  let mapPath = `/about`;
  if (typeof __PREFIX_PATHS__ !== `undefined` && __PREFIX_PATHS__) {
    mapPath = __PATH_PREFIX__ + mapPath;
  }

  const {
    isRoot,
    isTag,
    isAbout,
  } = useMemo(() => {
    const isRoot = location.pathname === rootPath;
    const isTag = location.pathname.startsWith(tagPath);
    const isAbout = location.pathname.startsWith(mapPath);
    return {
      isRoot,
      isTag,
      isAbout,
    }
  }, [ location ])

  const rootThumbnailPath = useRootThumbnailPath()

  const { headerImage } = useBackgroundImages()
  const headerImageData = headerImage.childImageSharp.fluid

  const header = useMemo(() => {

    if (isRoot) {
      return (
        <BackgroundImage
          Tag="div"
          className={styles.header_container}
          fluid={headerImageData}
          backgroundColor={`#8A5E5F`}
        >
          <Seo isRoot={true} thumbnailSrc={rootThumbnailPath}/>
          <div className={styles.header_container__inner}>
            <h1 className={styles.blog_title_area}>
              <Link
                className={styles.blog_title}
                to={'/'}
              >Takumon Blog</Link>
            </h1>
            <Bio />
          </div>
          <Rss />
        </BackgroundImage>
      );
    }
    
    if(isTag) {
      return (
        <BackgroundImage
          Tag="div"
          className={styles.header_container}
          fluid={headerImageData}
          backgroundColor={`#8A5E5F`}
        >
          <Seo isRoot={true} thumbnailSrc={rootThumbnailPath}/>
          <div className={styles.header_container__inner}>
            <h1 className={styles.blog_title_area}>
              <Link
                className={styles.blog_title}
                to={'/'}
              >Takumon Blog</Link>
            </h1>
            <Bio />
          </div>
          <Rss />
        </BackgroundImage>
      );
    }

    if(isAbout) {
      return (
        <BackgroundImage
          Tag="div"
          className={styles.header_container}
          fluid={headerImageData}
          backgroundColor={`#8A5E5F`}
        >
          <Seo isRoot={true} thumbnailSrc={rootThumbnailPath}/>
          <div className={styles.header_container__inner}>
            <h1 className={styles.blog_title_area}>
              <Link
                className={styles.blog_title}
                to={'/'}
              >ABOUT ME</Link>
            </h1>
            <Bio />
          </div>
          <Rss isAbout={isAbout}/>
        </BackgroundImage>
      );
    }
    
    return '';
  }, [ isRoot, isTag, isAbout ])



  return (
    <div className={styles.root_container}>
      <UserHeat />
      {header}
      {children}
      <Footer isRoot={isRoot} />
    </div>
  )
}


export default Layout