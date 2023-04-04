import React, { useMemo } from 'react'
import { Link } from 'gatsby'
import { css, keyframes } from '@emotion/react'
import 'katex/dist/katex.min.css'

import config from '../config/blog-config'
import Title from './Title'
// import Adsense from './Adsense';
import SNSShare from './SNSShare'
import PostMetaInfo from './PostMetaInfo'
import Seo from './SEO'
import Iframely from './Iframely'
import ScrollSyncToc from './ScrollSyncToc'
import Image from './Thumbnail'
import Pagination from './Pagination'
import useIsScrollDownTo from '../hooks/useIsScrollDownTo'
import { DarkToggle } from './DarkToggle'
import tomato from '../images/tomato.svg'
import overlay2 from '../images/overlay2.png'
import overlay4 from '../images/overlay4.svg'
import { HeadingDetail, PageContextPost } from 'index'

type Props = {
  item: GatsbyTypes.MarkdownRemark
  headings: HeadingDetail
  pageContext: PageContextPost
  siteTitle: string
}

const Post: React.FC<Props> = ({ item, headings, pageContext: { previous, next, slug, relatedPosts, latestPosts, thumbnail }, siteTitle }) => {
  const isShowSnsShare = useIsScrollDownTo(400)

  const postUrl = `${config.blogUrl}${slug}`

  const cssSnsShare = useMemo(() => {
    return [styles.sns_share, isShowSnsShare ? styles.sns_share_show : styles.sns_share_hide]
  }, [isShowSnsShare])

  return (
    <article>
      <Title postTitle={item.frontmatter.title} />
      <Iframely />
      <Seo
        isRoot={false}
        title={`${item.frontmatter.title} | ${siteTitle}`}
        description={item.excerpt ?? ``} // TODO excerpt型修正
        postUrl={postUrl}
        postDate={item.frontmatter.date}
        thumbnailSrc={thumbnail.node.childImageSharp.gatsbyImageData.images.fallback.src}
      />

      <div css={styles.header}>
        <DarkToggle />
        <div css={styles.header__inner}>
          <div css={styles.header__inner__content}>
            <h4 css={styles.blog_title}>
              <Link css={styles.blog_title__link} to={'/'}>
                {config.blogTitle}
                <i css={styles.blog_title__icon} />
              </Link>
            </h4>

            <a href={postUrl} rel="current" css={styles.post_title}>
              <h1>{item.frontmatter.title}</h1>
            </a>

            <PostMetaInfo tags={item.frontmatter.tags} date={item.frontmatter.date} color={`#fff`} />
          </div>
        </div>
      </div>

      <div css={styles.container}>
        <div css={styles.post}>
          <div>
            <Image filename={item.frontmatter.thumbnail || config.defaultThumbnailImagePath} alt={'thumbnail'} />
          </div>
          {/* TODO html型修正 */}
          <div dangerouslySetInnerHTML={{ __html: item.html ?? '' }} />
          {/* <div>
            <Adsense />
          </div> */}
        </div>

        <div css={styles.toc}>
          <ScrollSyncToc headings={headings} />
          {/* <div>
            <Adsense />
          </div> */}
        </div>
        <div css={cssSnsShare}>
          <SNSShare title={item.frontmatter.title} link={postUrl} twitterUserName={config.blogAuthorTwitterUserName} />
        </div>

        <div css={styles.paging}>
          <Pagination previous={previous} next={next} relatedPosts={relatedPosts} latestPosts={latestPosts} />
        </div>
      </div>
    </article>
  )
}

export default Post

const sectionBorder = '3px'

const fadeInDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
    -webkit-transform: translateY(-10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    -webkit-transform: translateY(0);
  }
`

const showBackground = keyframes`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`

const styles = {
  blog_title: css`
    text-transform: none;
    margin: 0 0 1em;
    text-align: left;
  `,
  blog_title__link: css`
    box-shadow: none;
    text-decoration: none;
    font-family: Montserrat;
    color: var(--titleRevert);
  `,
  blog_title__icon: css`
    display: inline-block;
    vertical-align: bottom;
    background-image: url(${tomato});
    width: 1em;
    height: 1em;
    background-repeat: no-repeat;
    margin: 0 0 0.4em 0.2em;
  `,
  post_title: css`
    box-shadow: none;
    margin-top: 0.5em;
    margin-bottom: 1em;
    display: block;
    text-align: left;

    h1 {
      color: var(--titleRevert);
      font-weight: 200;
      font-size: 2.5em;
      line-height: 1.4;
      margin: 0;
    }

    @media screen and (max-width: 580px) {
      h1 {
        font-size: 1.7em;
      }
    }

    @media screen and (max-width: 400px) {
      h1 {
        font-size: 1.4em;
        line-height: 1.3;
      }
    }
  `,
  header: css`
    position: relative;
    min-height: 65vh;
    display: flex;
    align-items: center;
    background-attachment: fixed, fixed, fixed;
    background-image: url(${overlay2}), url(${overlay4}), var(--headerBG);
    background-position: top left, top left, top left;
    background-size: auto, cover, cover;
    overflow: hidden;
    position: relative;
    text-align: center;
    filter: var(--bannerBGFilter);
    transition: filter 200ms var(--transitionMode) !important;

    &:after {
      -moz-pointer-events: none;
      -webkit-pointer-events: none;
      -ms-pointer-events: none;
      pointer-events: none;
      background: var(--headerBGBase);
      content: '';
      display: block;
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 1;
      animation: ${showBackground} 1.2s both 1s;
    }

    @media screen and (max-width: 720px) {
      min-height: 400px;
      background-attachment: scroll, scroll, scroll;
      background-image: url(${overlay2}), url(${overlay4}), var(--headerBGMiddle);
    }

    @media screen and (max-width: 400px) {
      min-height: 300px;
      background-image: url(${overlay2}), url(${overlay4}), var(--headerBGMiddle);
    }
  `,
  header__inner: css`
    display: grid;
    width: 100%;
    grid-template-columns: 100px calc(100% - 100px - 300px) 300px;
    max-width: 1200px;
    margin-right: auto;
    margin-left: auto;

    @media screen and (max-width: 1200px) {
      grid-template-columns: minmax(420px, 820px) 1fr;
    }

    @media screen and (max-width: 940px) {
      grid-template-columns: minmax(0px, 900px);
    }
  `,
  header__inner__content: css`
    z-index: 2;
    grid-column: 2 / 3;
    animation: ${fadeInDown} 0.6s both;
    padding: 1em 1em 0 1em;
    max-width: 720px;

    @media screen and (max-width: 1200px) {
      grid-column: 1 / 2;
    }

    @media screen and (max-width: 940px) {
      grid-column: 1 / 2;
      margin-left: auto;
      margin-right: auto;
    }
  `,
  container: css`
    display: grid;
    grid-template-columns: 100px calc(100% - 100px - 300px) 300px;
    max-width: 1200px;
    margin-right: auto;
    margin-left: auto;

    @media screen and (max-width: 1200px) {
      grid-template-columns: minmax(420px, 820px) 1fr;
    }

    @media screen and (max-width: 940px) {
      overflow-x: hidden;
      grid-template-columns: minmax(0px, 900px);
      margin-left: 0;
      margin-right: 0;
    }

    @media screen and (max-width: 720px) {
      grid-template-columns: minmax(0px, 720px);
      margin-left: 0;
      margin-right: 0;
      max-width: none;
    }
  `,
  post: css`
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    padding: 1em;

    @media screen and (max-width: 1200px) {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }

    @media screen and (max-width: 940px) {
      width: 100vw;
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      margin-left: auto;
      margin-right: auto;
    }

    @media screen and (max-width: 720px) {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
      margin-left: 0;
      margin-right: 0;
    }

    @media screen and (max-width: 580px) {
      ul > li {
        margin-left: 0.75rem;
      }
      ol li {
        margin-left: 0.75rem;
      }
    }

    @media screen and (max-width: 400px) {
      h1 {
        margin-bottom: 0.7rem;
        font-size: 1.6rem;
      }
      h2 {
        margin-top: 3rem;
        margin-bottom: 1rem;
        font-size: 1.4rem;
        border-bottom: 3px solid var(--underline);
        position: relative;
      }
      h2::before {
        position: absolute;
        content: ' ';
        width: 100px;
        bottom: -3px;
        height: 3px;
        background-color: var(--accent);
      }
      h3 {
        margin-top: 1.2rem;
        margin-bottom: 0.7rem;
        font-size: 1.2rem;
        position: relative;
      }
      h3::before {
        position: absolute;
        content: ' ';
        width: 100px;
        bottom: -3px;
        height: 1px;
        background-color: var(--underline);
      }
      h4 {
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        font-size: 1rem;
      }
      h5 {
        margin-top: 0.8rem;
        margin-bottom: 0.2rem;
        font-size: 1rem;
      }
      h6 {
        margin-top: 0.5rem;
        margin-bottom: 0.1rem;
        font-size: 0.8rem;
      }
    }

    > ul {
      margin-left: 0;
    }
    > ol {
      margin-left: 0;
    }

    > ul > li {
      margin-left: 0;
    }
    > ol > li {
      margin-left: 0;
    }

    ul > li {
      margin-left: 1.5rem;
      margin-bottom: 0.3rem;
    }
    ul > li > p {
      margin-bottom: 0.3rem;
    }
    li > ul {
      margin-top: 0rem;
      margin-left: 0rem;
    }
    ol > li {
      margin-left: 1.5rem;
      margin-bottom: 0.3rem;
    }
    li > ol {
      margin-left: 0rem;
    }

    /* セクションのスタイル */
    h2 {
      margin-top: 3rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: ${sectionBorder} solid var(--underline);
      position: relative;
    }
    h2::before {
      position: absolute;
      content: ' ';
      width: 100px;
      bottom: -${sectionBorder};
      height: ${sectionBorder};
      background-color: var(--accent);
    }
    h3 {
      margin-top: 2rem;
      padding-bottom: 0.3rem;
      margin-bottom: 1rem;
      position: relative;
    }
    h3::before {
      position: absolute;
      content: ' ';
      width: 100px;
      bottom: -3px;
      height: 1px;
      background-color: var(--underline);
    }
    h4 {
      margin-top: 1rem;
      margin-bottom: 0.8rem;
      font-size: 1.2rem;
    }
    h5 {
      margin-top: 0.8rem;
      margin-bottom: 0.5rem;
      font-size: 0.8rem;
    }
    h6 {
      margin-top: 0.5rem;
      margin-bottom: 0.3rem;
      font-size: 0.8rem;
    }

    pre {
      font-size: 0.85rem;
    }

    code {
      font-size: 0.85rem;
    }
    code.language-text {
      background: var(--codeBG);
      color: var(--codeText);
    }

    /* ブラウザ幅が狭くなった時にテーブルを横スクロールさせて、スマホでも大きいテーブルが見れるようにする */
    table {
      display: block;
      overflow: auto;
    }
  `,
  toc: css`
    position: sticky;
    position: -webkit-sticky;
    max-height: 100vh;
    overflow-y: auto;
    will-change: transform;
    top: 12px;
    padding: 12px;
    margin-top: 64px;

    grid-column: 3 / 4;
    grid-row: 1 / 2;

    @media screen and (max-width: 1200px) {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }

    @media screen and (max-width: 940px) {
      display: none;
    }
  `,
  sns_share: css`
    grid-column: 1 / 2;
    grid-row: 1 / 3;
    padding: 24px 12px 12px 12px;
    margin-top: 200px;
    height: 300px;
    position: sticky;
    position: -webkit-sticky;
    top: 0;
    will-change: transform;

    ul {
      display: flex;
      flex-direction: column;
      opacity: 0.3;
      filter: grayscale(100%);
      transition: filter 0.6s linear, opacity 0.6s linear;

      &:hover {
        opacity: 1;
        filter: grayscale(0%);
        transition: filter 0.1s linear, opacity 0.1s linear;
      }

      li {
        margin: 0 0 12px 12px;
      }
    }

    @media screen and (max-width: 1200px) {
      grid-column: 1 / 2;
      grid-row: 2/3;
      height: 64px;
      margin: 12px 0 64px 0;

      ul {
        display: flex;
        flex-direction: row;
        opacity: 1;
        filter: grayscale(0%);

        &:hover {
          opacity: 1;
          filter: grayscale(0%);
          transition: filter 0.1s linear, opacity 0.1s linear;
        }

        li {
          margin: 0 0 12px 12px;
        }
      }
    }

    @media screen and (max-width: 940px) {
      grid-column: 1 / 1;
      grid-row: 2/3;
      height: 64px;
      margin: 12px 0 64px 0;

      ul {
        display: flex;
        flex-direction: row;
        opacity: 1;
        filter: grayscale(0%);

        &:hover {
          opacity: 1;
          filter: grayscale(0%);
          transition: filter 0.1s linear, opacity 0.1s linear;
        }

        li {
          margin: 0 0 12px 12px;
        }
      }
    }
  `,
  paging: css`
    grid-column: 2 / 3;
    grid-row: 2 / 3;
    margin: 0 0 64px 0;

    @media screen and (max-width: 1200px) {
      grid-column: 1 / 2;
      grid-row: 3 / 4;
    }

    @media screen and (max-width: 940px) {
      grid-column: 1 / 2;
      grid-row: 3 / 4;
    }
  `,
  sns_share_show: css`
    visibility: visible;
    opacity: 1;
    -webkit-transition: visibility 0s linear 0s, opacity 0.3s 0s;
    transition: visibility 0s linear 0s, opacity 0.3s 0s;

    @media screen and (max-width: 1200px) {
      opacity: 1;
      visibility: visible;
    }

    @media screen and (max-width: 940px) {
      opacity: 1;
      visibility: visible;
    }
  `,
  sns_share_hide: css`
    visibility: hidden;
    opacity: 0;
    -webkit-transition: visibility 0s linear 0.3s, opacity 0.3s 0s;
    transition: visibility 0s linear 0.3s, opacity 0.3s 0s;

    @media screen and (max-width: 1200px) {
      opacity: 1;
      visibility: visible;
    }

    @media screen and (max-width: 940px) {
      opacity: 1;
      visibility: visible;
    }
  `,
}
