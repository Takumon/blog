import React from 'react'
import { Helmet } from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

type Props = {
  postTitle?: string // 記事のタイトル
  tag?: string // 絞り込み検索用タグ
}

const Title: React.FC<Props> = ({ postTitle, tag }) => {
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
