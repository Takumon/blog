import React from 'react'
import { css } from '@emotion/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/free-solid-svg-icons'

import { maxContentWidth } from '../styles/mixinStyle'

import Title from '../components/Title'
import PostList from '../components/PostList'
import Tag from '../components/Tag'
import TagList from '../components/TagList'
import type { PageContextTags } from '../@types'

type Props = {
  pageContext: PageContextTags
}

const TagsTemplate: React.FC<Props> = ({ pageContext }) => {
  const posts = pageContext.nodes
  const totalCount = posts && posts.length ? posts.length : 0

  const targetTag = <Tag value={pageContext.tag} />

  const tagSearchResult = (
    <div css={styles.tag_search_result}>
      <FontAwesomeIcon icon={faTags} css={styles.tag_icon} />
      {targetTag}
      {totalCount}件
    </div>
  )

  const postList = totalCount > 0 ? <PostList postFields={posts} /> : <div css={styles.no_post}>指摘したタグの記事はありません。</div>

  return (
    <div>
      <Title tag={pageContext.tag} />
      {tagSearchResult}
      {postList}
      <TagList tagCounts={pageContext.tagCounts} />
    </div>
  )
}

export default TagsTemplate

const styles = {
  tag_search_result: css`
    ${maxContentWidth}
    padding: 1em 0 0 1em;
    display: flex;
    align-items: center;
  `,

  tag_icon: css`
    margin-right: 0.5em;
  `,

  no_post: css`
    ${maxContentWidth}
    padding: 1em 0 0 1em;
    display: flex;
    align-items: center;
  `,
}
