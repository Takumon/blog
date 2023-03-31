import React from 'react'
import { css } from '@emotion/react'
import { Link } from 'gatsby'

import PostMetaInfo from './PostMetaInfo'
import Image from './Thumbnail'
import config from '../config/blog-config'

type Props = {
  postField: {
    slug: string
    title: string
    // excerpt: string
    date: string
    tags: string[]
    thumbnail: string
  }
}

const PostPreviewSmall: React.FC<Props> = ({ postField: { slug, title, date, tags, thumbnail } }) => {
  return (
    <Link key={slug} css={styles.content_link} to={slug}>
      <div css={styles.content_thumbnail}>
        <Image css={styles.content_thumbnail_image} filename={thumbnail || config.defaultThumbnailImagePath} alt={'thumbnail'} />
      </div>
      <div css={styles.content_post_info}>
        <h2>{title}</h2>
        <div css={styles.post_meta_info}>
          <PostMetaInfo tags={tags} date={date} />
        </div>
      </div>
    </Link>
  )
}

export default PostPreviewSmall

const styles = {
  content_link: css`
    display: block;
    padding: 12px;
    border-radius: 4px;
    box-shadow: var(--cardBS);
    box-sizing: border-box;
    margin-bottom: 1.5rem;
    background-color: var(--bgLight);
    color: var(--title);
    transition: background-color 0.1s linear;
  `,

  content_thumbnail: css`
    width: 5rem;
    height: 5rem;
    float: left;
  `,

  content_thumbnail_image: css`
    border-radius: 4px;
    object-fit: contain;
    width: 100%;
    height: 100%;
  `,

  content_post_info: css`
    display: table-cell;
    vertical-align: middle;
    height: 5rem;
    padding: 0 0.75rem;

    h2 {
      font-size: 1rem;
      margin-bottom: 0.7rem;
      margin-top: 0rem;
      border-bottom: 0;
      transition: color 0.1s linear;
      @media screen and (max-width: 680px) {
        font-size: 0.7rem;
      }
    }

    p {
      font-size: 1rem;
    }

    &:hover {
      background-color: var(--bgLight);
      transition: background-color 0.3s linear;

      h2 {
        transition: color 0.3s liner;
      }
    }
  `,

  post_meta_info: css`
    font-size: 14px;
    * {
      color: var(--textLightLittle);
    }
  `,

  meta_info: css`
    color: var(--textLightLittle);
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
