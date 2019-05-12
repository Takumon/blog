import React from 'react';
import { Link } from 'gatsby'
import { throttle } from 'lodash'
import ClassNames from 'classnames';
import 'katex/dist/katex.min.css';

import config from '../../config/blog-config';
import Title from '../title';
import SNSShare from '../sns-share'
import PostMetaInfo from '../post-meta-info'
import Seo from '../seo';
import Iframely from '../iframely';
import ScrollSyncToc from '../toc/scroll-sync-toc';
import Image from '../image';
import Paging from '../paging';
import styles from './index.module.scss';



class Post extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowSnsShare: false
    }
  }

  componentDidMount() {
    this.stock = this.watchCurrentPosition.bind(this)
    window.addEventListener('scroll', throttle(this.stock, 500), true) // 負荷軽減のため50msecごとにまびく
  }

  componentWillUnmount() {
    this.stock && window.removeEventListener('scroll', this.stock, true)
    this.stock = null
  }

  watchCurrentPosition() {
    this.setState({isShowSnsShare: this.scrollTop() > 400})
  }

  scrollTop() {
      return Math.max(
          window.pageYOffset,
          document.documentElement.scrollTop,
          document.body.scrollTop)
  }

  render() {
    const {
      fields,
      headings,
      html,
      pageContext: { 
        previous, 
        next, 
        slug,
        relatedPosts,
        latestPosts,
      },
      siteTitle,
    } = this.props

    const postUrl = `${config.blogUrl}${slug}`


    const classNameSnsShare = ClassNames({
      [`${styles.sns_share}`] : true,
      [`${styles.sns_share_show}`]: this.state.isShowSnsShare,
      [`${styles.sns_share_hide}`]: !this.state.isShowSnsShare,
    })


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
          largeImage={fields.thumbnail}
          />

        <div className={styles.header}>
          <div className={styles.header__inner}>
            <div className={styles.header__inner__content}>

              <h4 className={styles.blog_title}>
                <Link
                  className={styles.blog_title__link}
                  to={'/'} >
                  {config.blogTitle}
                  <i className={styles.blog_title__icon}></i>
                </Link>
              </h4>

              <a href={postUrl} rel="current" className={styles.post_title}>
                <h1>
                  {fields.title}
                </h1>
              </a>

              <PostMetaInfo
                tags={fields.tags}
                date={fields.date}
                color={`#fff`}
                />
            </div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.post}>
            <div className={styles.post_thumbnail}>
              <Image
                filename={fields.thumbnail || config.defaultThumbnailImagePath}
                alt={'thumbnail'}
              />
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
          <div className={styles.toc}>
            <ScrollSyncToc headings={headings} />
          </div>
          <div className={classNameSnsShare}>
            <SNSShare
              title={fields.title}
              link={postUrl}
              twitterUserName={config.blogAuthorTwitterUserName}
              />
          </div>

          <div className={styles.paging}>
            <Paging 
              previous={previous} 
              next={next} 
              relatedPosts={relatedPosts} 
              latestPosts={latestPosts}
            />
          </div>
        </div>
      </article>
    )
  }
}



export default Post