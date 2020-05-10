import React from 'react'


const WordCloudSection = ({ wordCloudText, wordCloudTag }) => {

  const wordCloudTextSvg = (
    <div
      dangerouslySetInnerHTML={{__html: wordCloudText}}
      style={{
        width: '100%',
        paddingTop: '12px',
        paddingBottom: '12px',
        background: '#f7f7f7',
      }}
    />
  )

  const wordCloudTagSvg = (
    <div
      dangerouslySetInnerHTML={{__html: wordCloudTag}}
      style={{
        width: '100%',
        paddingTop: '12px',
        paddingBottom: '12px',
        background: '#f7f7f7',
      }}
    />
  )

  return (
    <>
      <h2 style={{
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>WordCloud</h2>
      <div style={{
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '64px',
      }}>
        自分の記事の本文とタグをインプットにして作成したWordCloudです。
      </div>

      <div style={{
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '64px',
      }}>
        {wordCloudTagSvg}
      </div>

      <div style={{
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '64px',
      }}>
        {wordCloudTextSvg}
      </div>
    </>
  )
}

export default WordCloudSection