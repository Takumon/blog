import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { graphql } from 'gatsby';
import { useMemo } from "react";
import { css, keyframes } from '@emotion/react'
import PostList from "../components/PostList";
import Title from "../components/Title";
import _orderBy from 'lodash/orderBy'
import TagList from "../components/TagList";
import { TagCounts } from "index";


const IndexPage: React.FC<PageProps<GatsbyTypes.Query>> = ({data}) => {

// マージして降順で並び替え
  // gatsby-node.jsで2つのノードに共通のfieldsを追加しているため条件分岐なし
  const posts = data.allMarkdownRemark.edges

  
  const tagCounts = useMemo(
    () => {
      const _result: TagCounts = []

      posts.forEach(post => {
        post.node.frontmatter?.tags?.forEach(t => {
          if (!t) {
            return
          }

          // TODO Qiita対応を除外するなら削除
          if ('Qiita' === t) {
            return
          }

          const targetData = _result.find(data => data.text === t)
          if (targetData) {
            targetData.size = targetData.size + 1
          } else {
            _result.push({
              text: t,
              size: 1,
            })
          }
        })
      })

      return _orderBy(_result, ['size', 'text'], ['desc', 'asc'])
    },
    [posts]
  )

  const postFields = useMemo(() => posts.map(post => post.node), [posts])

  return (
    <>
      <Title />
      <PostList postFields={postFields} />
      <TagList tagCounts={tagCounts} />
    </>
  )
}


export const query = graphql`
query {
  allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
    edges {
      node {
        excerpt
        frontmatter {
          slug
          title
          date
          tags
          thumbnail
        }
      }
    }
  }
}
`;

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>

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
