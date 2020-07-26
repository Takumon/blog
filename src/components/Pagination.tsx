import React from 'react'
import { Link } from 'gatsby'
import { css, keyframes } from '@emotion/core'

import PostPreviewSmall from './PostPreviewSmall'

type Props = {
  previous: any
  next: any
  relatedPosts: any
  latestPosts: any
}

const Pagination: React.FC<Props> = ({ previous, next, relatedPosts, latestPosts }) => {
  return (
    <div css={styles.context}>
      <div css={styles.context_header}>
        <i css={styles.context_header_tomato} />
        <i css={styles.context_header_tomato} />
        <i css={styles.context_header_tomato} />
        <i css={styles.context_header_tomato} />
      </div>

      {previous && (
        <div css={styles.posts_context}>
          <h2 css={styles.posts_category}>←前の記事</h2>
          <PostPreviewSmall key={previous.fields.slug} postField={previous.fields} />
        </div>
      )}

      {next && (
        <div css={styles.posts_context}>
          <h2 css={styles.posts_category}>次の記事→</h2>
          <PostPreviewSmall key={next.fields.slug} postField={next.fields} />
        </div>
      )}

      {relatedPosts && relatedPosts.length > 0 && (
        <div css={styles.posts_context}>
          <h2 css={styles.posts_category}>関連記事</h2>

          {relatedPosts.map(p => (
            <PostPreviewSmall key={p.fields.slug} postField={p.fields} />
          ))}
        </div>
      )}

      {latestPosts && latestPosts.length > 0 && (
        <div css={styles.posts_context}>
          <h2 css={styles.posts_category}>最近の記事</h2>

          {latestPosts.map(p => (
            <PostPreviewSmall key={p.fields.slug} postField={p.fields} />
          ))}
        </div>
      )}

      <div css={styles.posts_context}>
        <Link css={styles.link_to_list} to="/" rel="prev">
          <i css={styles.tomato_icon_1} />
          <i css={styles.tomato_icon_2} />
          <span css={styles.tomato_icon_title}>記事一覧</span>
          <i css={styles.tomato_icon_3} />
          <i css={styles.tomato_icon_4} />
        </Link>
      </div>
    </div>
  )
}

export default Pagination

const pageLink = css`
  display: block;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px rgba(63, 63, 68, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 1em;
  color: #444;
  background-color: #ffffff;
  transition: background-color 0.1s linear, color 0.1s linear;
  &:hover {
    background-color: #dc3614;
    color: black;
    transition: background-color 0.3s linear, color 0.3s liner;
  }
`

const spin = keyframes`
  0% {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}
`

const tomato = (rotateDegree: string) => {
  return css`
    display: inline-block;
    box-sizing: border-box;
    vertical-align: bottom;
    background-image: url(../../images/tomato.svg);
    width: 1.2rem;
    height: 1.2rem;
    background-repeat: no-repeat;
    margin: 0.5rem;

    -webkit-transform: rotate(${rotateDegree});
  `
}

const rotatingTomato = (delayTime: string) => {
  return css`
    ${tomato('0deg')}
    animation: ${spin} 2s linear ${delayTime} infinite;
  `
}

const styles = {
  context: css`
    padding: 2rem 0;
    background: rgb(238, 238, 238);
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px rgba(63, 63, 68, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
  `,

  context_header: css`
    margin-top: -1rem;
    text-align: center;
  `,

  context_header_tomato: css`
    ${tomato('0deg')}
  `,

  posts_category: css`
    font-size: 1rem;
    text-align: left;
    box-shadow: none;
    border-bottom: 1px dotted gray;
    letter-spacing: 0.7rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    color: gray;
  `,

  posts_context: css`
    padding: 12px;
    margin: 0;
  `,

  link_to_list: css`
    width: 100%;
    text-align: center;
    ${pageLink}
    font-size: 1rem;
    line-height: 2rem;
  `,

  tomato_icon_title: css`
    letter-spacing: 1rem;
    margin-right: -1rem;
  `,

  tomato_icon_1: css`
    ${rotatingTomato('0.4s')}
  `,

  tomato_icon_2: css`
    ${rotatingTomato('0.8s')}
  `,

  tomato_icon_3: css`
    ${rotatingTomato('1.2s')}
  `,

  tomato_icon_4: css`
    ${rotatingTomato('1.6s')}
  `,
}
