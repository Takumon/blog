import React from 'react'
import { Helmet } from 'react-helmet'
import useTitle from '../hooks/useTitle'

type Props = {
  postTitle?: string // 記事のタイトル
  tag?: string // 絞り込み検索用タグ
}

const Title: React.FC<Props> = ({ postTitle, tag }) => {
  const title = useTitle()

  const titleText = `${tag || postTitle || ''}${title}`

  return <Helmet htmlAttributes={{ lang: 'ja' }} title={titleText} />
}

export default Title
