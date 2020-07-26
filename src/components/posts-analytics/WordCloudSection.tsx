import React from 'react'
import { css } from '@emotion/core'

type Props = {
  wordCloudText: string
  wordCloudTag: string
}

const WordCloudSection: React.FC<Props> = ({ wordCloudText, wordCloudTag }) => {
  const wordCloudTextSvg = <div dangerouslySetInnerHTML={{ __html: wordCloudText }} css={styles.text_svg} />

  const wordCloudTagSvg = <div dangerouslySetInnerHTML={{ __html: wordCloudTag }} css={styles.tag_svg} />

  return (
    <>
      <h2 css={styles.title}>My Interest</h2>
      <div css={styles.description}>This is a WordCloud that express my interest based on the tags in the blog post.</div>

      <div css={styles.svg_container}>{wordCloudTagSvg}</div>

      <div css={styles.svg_container}>{wordCloudTextSvg}</div>
    </>
  )
}

export default WordCloudSection

const styles = {
  text_svg: css`
    width: 100%;
    padding-top: 12px;
    padding-bottom: 12px;
    background: #f7f7f7;
  `,

  tag_svg: css`
    width: 100%;
    padding-top: 12px;
    padding-bottom: 12px;
    background: #f7f7f7;
  `,

  title: css`
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  `,

  description: css`
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 64px;
  `,

  svg_container: css`
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 64px;
  `,
}
