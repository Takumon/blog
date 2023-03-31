import React from 'react'
import { css } from '@emotion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags } from '@fortawesome/free-solid-svg-icons'
import type { TagCounts } from '../@types'
import { maxContentWidth } from '../styles/mixinStyle'

import Tag from './Tag'

type Props = {
  tagCounts: TagCounts
}

const TagList: React.FC<Props> = ({ tagCounts }) => {
  return (
    <div css={styles.content}>
      <h3 css={styles.title}>
        <FontAwesomeIcon icon={faTags} css={styles.title__icon} />
        タグ一覧
      </h3>
      <div css={styles.list}>
        {tagCounts.map((t) => (
          <Tag key={t.text} value={t.text} count={t.size} />
        ))}
      </div>
    </div>
  )
}

export default TagList

const styles = {
  content: css`
    ${maxContentWidth}
    padding: 1em;
    margin-top: 2em;
    margin-bottom: 2em;
  `,

  title: css`
    margin: 0 0 12px;
    font-size: 1rem;
  `,

  title__icon: css`
    margin-right: 0.5em;
  `,

  list: css`
    display: flex;
    flex-wrap: wrap;
    padding: 1em;
    margin: 0;
    background: var(--bgLightLittle);
    border-radius: 4px;
  `,
}
