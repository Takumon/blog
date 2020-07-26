import React from 'react'
import { css } from '@emotion/core'
import { Link } from 'gatsby'
import BackgroundImage from 'gatsby-background-image'

import Bio from './Bio'
import config from '../config/blog-config'
import useBackgroundImages from '../hooks/useBackgroundImages'

type Props = {
  isRoot: boolean
}

const Footer: React.FC<Props> = ({ isRoot }) => {
  const bio = isRoot ? '' : <Bio />

  const { footerImage } = useBackgroundImages()

  return (
    footerImage && (
      <BackgroundImage Tag="footer" role="contentinfo" css={styles.content} fluid={footerImage} backgroundColor={`#8A5E5F`}>
        <div css={styles.content__inner}>
          {bio}
          <h3 css={styles.title}>
            <Link css={styles.title__link} to="/">
              {config.blogTitle}
              <i css={styles.tomato_icon} />
            </Link>
          </h3>

          <div css="copyright">
            Copyright © 2018. {config.blogAuthor}
            <a aria-label="blog_repository" href={config.blogRepositoryUrl} rel="noopener noreferrer" css={styles.github_icon} />
          </div>
        </div>
      </BackgroundImage>
    )
  )
}

export default Footer

const styles = {
  content: css`
    margin-top: 24px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    background-size: cover;
    background-position-x: center;

    a {
      color: white;
    }
  `,

  content__inner: css`
    padding: 24px 0 12px;
    margin: auto;
  `,

  title: css`
    font-family: Montserrat;
    text-transform: none;
    margin: 48px auto 8px;
    font-size: 1rem;
  `,

  title__link: css`
    box-shadow: none;
    text-decoration: none;
    color: inherit;
  `,

  copyright: css`
    font-size: 0.9em;
    display: inline-block;
    vertical-align: bottom;
  `,

  tomato_icon: css`
    display: inline-block;
    box-sizing: border-box;
    vertical-align: bottom;
    background-image: url(../../images/tomato.svg);
    width: 1em;
    height: 1em;
    background-repeat: no-repeat;
    margin: 0 0 0.4em 0.2em;
  `,

  github_icon: css`
    display: inline-block;
    margin-left: 12px;
    box-sizing: border-box;
    vertical-align: bottom;
    padding: 4px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    box-shadow: none;
    background-image: url(../../images/github.svg);
  `,
}
