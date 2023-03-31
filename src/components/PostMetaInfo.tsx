import React, { useMemo } from 'react'
import { css } from '@emotion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import Tag from './Tag'
import config from '../config/blog-config'

type Props = {
  tags: readonly string[]
  date: string
  color?: string
}

const PostMetaInfo: React.FC<Props> = ({ tags, date, color }) => {
  const tagList = tags.map((tag) => <Tag key={tag} value={tag} color={color} />)
  const formattedDate = useMemo(() => moment(date).format(config.dateFormat), [date])

  return (
    <small css={styles.content}>
      <div css={styles.date} style={{ color: color }}>
        <FontAwesomeIcon color={color} icon={faCalendarAlt} size="sm" />
        {formattedDate}
      </div>
      <div css={styles.tags}>
        <FontAwesomeIcon color={color} icon={faTags} size="sm" />
        {tagList}
      </div>
    </small>
  )
}

export default PostMetaInfo

const styles = {
  content: css`
    color: var(--textLightLittleLittle);
    font-family: sans-serif;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: -0.5em 0 1em;
  `,

  date: css`
    margin-right: 2em;
    font-size: 1.1em;

    > svg {
      margin-right: 0.5em;
    }
  `,

  tags: css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    & > svg {
      margin-right: 0.5em;
    }
  `,
}
