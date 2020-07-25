import React from 'react'
import styles from './word-cloud-section.module.scss'

const WordCloudSection = ({ wordCloudText, wordCloudTag }) => {
  const wordCloudTextSvg = <div dangerouslySetInnerHTML={{ __html: wordCloudText }} className={styles.text_svg} />

  const wordCloudTagSvg = <div dangerouslySetInnerHTML={{ __html: wordCloudTag }} className={styles.tag_svg} />

  return (
    <>
      <h2 className={styles.title}>My Interest</h2>
      <div className={styles.description}>This is a WordCloud that express my interest based on the tags in the blog post.</div>

      <div className={styles.svg_container}>{wordCloudTagSvg}</div>

      <div className={styles.svg_container}>{wordCloudTextSvg}</div>
    </>
  )
}

export default WordCloudSection
