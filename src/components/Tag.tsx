import React from 'react'
import { Link } from 'gatsby'
import { css } from '@emotion/core'
import { kebabCase } from 'lodash'

type Props = {
  value: string
  count: number
  color?: string
}

const Tag: React.FC<Props> = ({ value, count, color }) => {
  return (
    <div key={value} css={styles.content}>
      <Link to={`/tags/${kebabCase(value)}`} css={styles.link}>
        <div css={styles.tag_name} style={{ color: color }}>
          {value}
        </div>
        {count && <div css={styles.tag_count}>{count}</div>}
      </Link>
    </div>
  )
}

export default Tag

const styles = {
  content: css`
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-top: 1px solid #ccc;
    border-radius: 0.5em 0 0.5em 0;
    padding: 0.05em 0.75em;
    margin-right: 0.5em;
    margin-bottom: 0.5em;
    font-weight: bold;
    font-size: 0.75em;
  `,

  link: css`
    box-shadow: none;
    color: #4a4a4a;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  `,

  tag_name: css`
    display: inline-block;
    word-break: keep-all;
  `,

  tag_count: css`
    display: inline-block;
    background: #d0d0d0;
    border-radius: 0.5em;
    min-width: 3em; // 二桁対応
    padding: 0 1em;
    line-height: 1.5em;
    text-align: center;
    margin-left: 1em;
  `,
}
