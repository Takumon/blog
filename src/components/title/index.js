import React from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

// 受け取るデータ
//   postTitle (任意) 記事のタイトル
//   tag (任意) 絞り込み検索用タグ
const Title = ({ postTitle, tag }) => {
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const titleText = `${tag || postTitle || ''}${data.site.siteMetadata.title}`

  return <Helmet htmlAttributes={{ lang: 'ja' }} title={titleText} />
}

export default Title
