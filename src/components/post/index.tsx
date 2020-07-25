import React, { useState, useEffect, useMemo } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Link } from 'gatsby'
import ClassNames from 'classnames'
import 'katex/dist/katex.min.css'

import config from '../../config/blog-config'
import Title from '../Title'
// import Adsense from '../Adsense';
import SNSShare from '../SNSShare'
import PostMetaInfo from '../PostMetaInfo'
import Seo from '../SEO'
import Iframely from '../Iframely'
import ScrollSyncToc from '../ScrollSyncToc'
import Image from '../Thumbnail'
import Paging from '../paging'
import styles from './index.module.scss'

const useIsShowSnsShare = () => {
  const [isShowSnsShare, setIsShowSnsShare] = useState(false)

  const [onScroll] = useDebouncedCallback(() => {
    const top = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)

    setIsShowSnsShare(top > 400)
  }, 500)

  useEffect(
    () => {
      window.addEventListener('scroll', onScroll, true) // 負荷軽減のため50msecごとにまびく

      return () => {
        window.removeEventListener('scroll', onScroll, true)
      }
    },
    [onScroll]
  )

  return isShowSnsShare
}

const Post = ({ fields, headings, html, pageContext: { previous, next, slug, relatedPosts, latestPosts, thumbnail }, siteTitle }) => {
  const isShowSnsShare = useIsShowSnsShare()

  const postUrl = `${config.blogUrl}${slug}`

  const classNameSnsShare = useMemo(
    () => {
      return ClassNames({
        [`${styles.sns_share}`]: true,
        [`${styles.sns_share_show}`]: isShowSnsShare,
        [`${styles.sns_share_hide}`]: !isShowSnsShare,
      })
    },
    [isShowSnsShare]
  )

  return (
    <article>
      <Title postTitle={fields.title} />
      <Iframely />
      <Seo
        isRoot={false}
        title={`${fields.title} | ${siteTitle}`}
        description={fields.excerpt}
        postUrl={postUrl}
        postDate={fields.date}
        thumbnailSrc={thumbnail.node.childImageSharp.fluid.src}
      />

      <div className={styles.header}>
        <div className={styles.header__inner}>
          <div className={styles.header__inner__content}>
            <h4 className={styles.blog_title}>
              <Link className={styles.blog_title__link} to={'/'}>
                {config.blogTitle}
                <i className={styles.blog_title__icon} />
              </Link>
            </h4>

            <a href={postUrl} rel="current" className={styles.post_title}>
              <h1>{fields.title}</h1>
            </a>

            <PostMetaInfo tags={fields.tags} date={fields.date} color={`#fff`} />
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.post}>
          <div className={styles.post_thumbnail}>
            <Image filename={fields.thumbnail || config.defaultThumbnailImagePath} alt={'thumbnail'} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: html }} />
          {/* <div>
            <Adsense />
          </div> */}
        </div>
        <div className={styles.toc}>
          <ScrollSyncToc headings={headings} />
          {/* <div>
            <Adsense />
          </div> */}
        </div>
        <div className={classNameSnsShare}>
          <SNSShare title={fields.title} link={postUrl} twitterUserName={config.blogAuthorTwitterUserName} />
        </div>

        <div className={styles.paging}>
          <Paging previous={previous} next={next} relatedPosts={relatedPosts} latestPosts={latestPosts} />
        </div>
      </div>
    </article>
  )
}

export default Post
