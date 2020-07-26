import React from 'react'
import { css } from '@emotion/core'
import { Link } from 'gatsby'

import PostMetaInfo from './PostMetaInfo'
import Image from './Thumbnail'
import config from '../config/blog-config'

type Props = {
  postField: {
    slug: string
    title: string
    excerpt: string
    date: string
    tags: string[]
    thumbnail: string
  }
}

const PostPreview: React.FC<Props> = ({ postField: { slug, title, excerpt, date, tags, thumbnail } }) => {
  return (
    <article key={slug} css={styles.content}>
      <Link css={styles.title_link} to={slug}>
        <div css={styles.content_thumbnail_container}>
          <div css={styles.content_thumbnail}>
            <Image css={styles.content_thumbnail_image} filename={thumbnail || config.defaultThumbnailImagePath} alt={'thumbnail'} />
          </div>
        </div>
        <div css={styles.content_post_info}>
          <h2 css={styles.title}>{title}</h2>
          <p css={styles.content_text} dangerouslySetInnerHTML={{ __html: excerpt }} />
          <PostMetaInfo tags={tags} date={date} />
        </div>
      </Link>
    </article>
  )
}

export default PostPreview

const styles = {
  content: css`
    border-bottom: 1px solid #ebf2f6;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px rgba(63, 63, 68, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
    padding: 0.75rem 1.75rem;
    background: white;
    max-width: 100%;

    @media screen and (max-width: 400px) {
      padding: 0.75rem 0.75rem;
    }
  `,

  content_thumbnail_container: css`
    overflow: hidden;
    margin-bottom: 0.75rem;
    margin-left: -1.75rem;
    margin-right: -1.75rem;
    margin-top: -0.75rem;

    @media screen and (max-width: 400px) {
      margin-bottom: 0.75rem;
      margin-left: -0.75rem;
      margin-right: -0.75rem;
      margin-top: -0.75rem;
    }
  `,

  title_link: css`
    box-shadow: none;
    color: #4a4a4a;
    font-size: 1.2em;
    line-height: 1em;

    &:hover {
      opacity: 1;
      .content_thumbnail {
        transform: scale(1.04);
      }
      .title,
      .content_text {
        color: #989eb0;
      }
    }
    @media screen and (max-width: 400px) {
      font-size: 0.8em;
    }
  `,

  content_thumbnail: css`
    transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
  `,

  content_thumbnail_image: css`
    object-fit: contain;
    width: 100%;
    max-height: 230px;
    height: 100%;
    margin: 0;
  `,

  content_post_info: css`
    display: table-cell;
    vertical-align: middle;
    height: 5rem;
    padding: 0 0.5rem;

    @media screen and (max-width: 400px) {
      padding: 0 0.1rem;
    }
  `,

  title: css`
    margin-top: 0;
    margin-bottom: 0.3em;
    font-size: 16px;
    border-bottom: 0;
    word-break: break-all;
    transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
    @media screen and (max-width: 400px) {
      line-height: 1.1;
    }
  `,

  content_text: css`
    color: #414141;
    font-size: 12px;
    word-break: break-all;
    transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
  `,

  meta_info: css`
    color: #99a;
    font-family: sans-serif;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: -0.5em 0 2em;
  `,

  meta_info__date: css`
    margin-right: 2em;
    font-size: 1.1em;

    & > svg {
      margin-right: 0.5em;
    }
  `,

  meta_info__tags: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    & > svg {
      margin-right: 0.5em;
    }
  `,
}
