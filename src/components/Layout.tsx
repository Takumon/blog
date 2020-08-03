import React, { useMemo } from 'react'
import { css } from '@emotion/core'
import { Link } from 'gatsby'
import BackgroundImage from 'gatsby-background-image'
import type { WindowLocation } from '@reach/router'

import NormalizeStyle from '../styles/NormalizeStyle'
import GlobalStyle from '../styles/GlobalStyle'
import HighlightStyle from '../styles/HighlightStyle'

import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

import { flexColumnCenter } from '../styles/mixinStyle'
import Seo from './SEO'
import Footer from './Footer'
import Bio from './Bio'
import HeaderAction from './HeaderAction'
import UserHeat from './UserHeat'
import useSpecificImages from '../hooks/useSpecificImages'
import useRootThumbnailPath from '../hooks/useRootThumbnailPath'
import { DarkToggle } from './DarkToggle'

type Props = {
  location: WindowLocation
}

const Layout: React.FC<Props> = ({ location, children }) => {
  const prefix: string = __PATH_PREFIX__ || ''
  const rootPath = `${prefix}/`
  const tagPath = `${prefix}/tags/`
  const mapPath = `${prefix}/about`

  const { isRoot, isTag, isAbout } = useMemo(() => {
    const isRoot = location.pathname === rootPath
    const isTag = location.pathname.startsWith(tagPath)
    const isAbout = location.pathname.startsWith(mapPath)
    return {
      isRoot,
      isTag,
      isAbout,
    }
  }, [location.pathname, mapPath, rootPath, tagPath])

  const rootThumbnailPath = useRootThumbnailPath()

  const { headerImage } = useSpecificImages()

  const header = useMemo(() => {
    if (!headerImage) {
      return null
    }

    if (isRoot) {
      return (
        <BackgroundImage Tag="div" css={styles.header_container} fluid={headerImage} backgroundColor={`#8A5E5F`}>
          <DarkToggle />
          <Seo isRoot={true} thumbnailSrc={rootThumbnailPath} />
          <div css={styles.header_container__inner}>
            <h1 css={styles.blog_title_area}>
              <Link css={styles.blog_title} to={'/'}>
                Takumon Blog
              </Link>
            </h1>
            <Bio />
          </div>
          <HeaderAction />
        </BackgroundImage>
      )
    }

    if (isTag) {
      return (
        <BackgroundImage Tag="div" css={styles.header_container} fluid={headerImage} backgroundColor={`#8A5E5F`}>
          <DarkToggle />
          <Seo isRoot={true} thumbnailSrc={rootThumbnailPath} />
          <div css={styles.header_container__inner}>
            <h1 css={styles.blog_title_area}>
              <Link css={styles.blog_title} to={'/'}>
                Takumon Blog
              </Link>
            </h1>
            <Bio />
          </div>
          <HeaderAction />
        </BackgroundImage>
      )
    }

    if (isAbout) {
      return (
        <BackgroundImage Tag="div" css={styles.header_container} fluid={headerImage} backgroundColor={`#8A5E5F`}>
          <DarkToggle />
          <Seo isRoot={true} thumbnailSrc={rootThumbnailPath} />
          <div css={styles.header_container__inner}>
            <h1 css={styles.blog_title_area}>
              <Link css={styles.blog_title} to={'/'}>
                ABOUT ME
              </Link>
            </h1>
            <Bio />
          </div>
          <HeaderAction isAbout={isAbout} />
        </BackgroundImage>
      )
    }

    return ''
  }, [isRoot, isTag, isAbout, headerImage, rootThumbnailPath])

  return (
    <div css={styles.root_container}>
      <NormalizeStyle />
      <GlobalStyle />
      <HighlightStyle />
      <UserHeat />
      {header}
      {children}
      <Footer isRoot={isRoot} />
    </div>
  )
}

export default Layout

const styles = {
  root_container: css`
    width: 100%;
    margin: 0;
    background: var(--bgLight);
  `,

  header_container: css`
    ${flexColumnCenter}
    background-size: cover;
    margin: 0;
    min-height: 65vh;
    position: relative;
    &:after,
    &:before {
      filter: var(--bannerBGFilter);
      transition: filter 200ms var(--transitionMode) !important;
    }

    & * {
      filter: none;
    }
    /* boi用 */
    & div {
      color: var(--bgLight);
    }

    @media screen and (max-width: 720px) {
      background-attachment: scroll;
    }
    @media screen and (max-width: 600px) {
      min-height: 40vh;
    }
    @media screen and (max-width: 500px) {
      min-height: 30vh;
    }
  `,

  header_container__inner: css`
    z-index: 2;
  `,

  blog_title_area: css`
    font-size: 4em;
    margin-bottom: 0.5em;
    margin-top: 0;
    font-family: Montserrat;
    line-height: 1.5;
    @media screen and (max-width: 600px) {
      text-align: center;

      a {
        font-size: 36px;
      }
    }

    @media screen and (max-width: 500px) {
      text-align: center;

      a {
        font-size: 28px;
      }
    }
  `,

  blog_title: css`
    box-shadow: none;
    font-family: Montserrats, ans-serif;
    color: var(--textLight);
    :hover {
      box-shadow: none;
    }
  `,
}
