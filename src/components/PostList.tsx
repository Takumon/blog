import React from 'react'
import { css, keyframes } from '@emotion/react'
import PostPreview from './PostPreview'
import usePaging from '../hooks/usePaging'

const PER_PAGE = 15

type Props = {
  postFields: GatsbyTypes.MarkdownRemark[]
}

const PostList: React.FC<Props> = ({ postFields }) => {
  const { filtered, hasNextPage, loadNextPage } = usePaging({
    list: postFields,
    perPage: PER_PAGE,
  })

  return (
    <div css={styles.content}>
      <div css={styles.content_inner}>
        {filtered.map((postField) => (
          <PostPreview key={postField.frontmatter.slug} postField={postField} />
        ))}
      </div>
      {hasNextPage ? (
        <div css={styles.pagination_area}>
          <button css={styles.pagination_button} onClick={loadNextPage}>
            Load More
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default PostList

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

const styles = {
  content: css`
    /* to make about button clickable */
    padding-top: 72px;
    width: 100%;
    background: var(--bgLightLittle);
    transition: background-color 400ms var(--transitionMode);
    @media screen and (max-width: 680px) {
      /* to make about button clickable */
      padding-top: 36px;
    }
    @media screen and (max-width: 580px) {
      /* to make about button clickable */
      padding-top: 72px;
    }
  `,

  content_inner: css`
    padding: 0 72px 72px 72px;
    animation: ${fadeInDown} 0.6s both 0.5s;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    /* grid-auto-rows: 1fr; */
    grid-gap: 40px;

    @media screen and (max-width: 680px) {
      padding: 0 36px 36px 36px;
      grid-gap: 20px;
    }
    @media screen and (max-width: 580px) {
      padding: 0 10px 10px 10px;
    }
    @media screen and (max-width: 450px) {
      grid-gap: 10px;
      grid-template-columns: repeat(auto-fit, minmax(90%, 1fr));
    }
  `,

  pagination_area: css`
    text-align: center;
    width: 100%;
    display: flex;
    justify-content: center;
    padding-bottom: 72px;
    @media screen and (max-width: 680px) {
      padding-bottom: 36px;
    }
    @media screen and (max-width: 580px) {
      padding-bottom: 10px;
    }
    @media screen and (max-width: 450px) {
      padding-bottom: 10px;
    }
  `,

  pagination_button: css`
    text-align: center;
    display: block;
    height: 48px;
    background-size: contain;
    box-shadow: none;
    color: var(--buttonColor);
    background: var(--buttonBG);
    border-radius: 24px;
    line-height: 25px;
    padding: 6px 24px;
    cursor: pointer;
    font-size: 24px;
    transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
    border: 0;

    &:hover {
      transform: scale(1.02);
      opacity: 0.7;
    }
  `,
}
