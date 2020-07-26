import React from 'react'
import { Location } from '@reach/router'
import { Link } from 'gatsby'
import { css } from '@emotion/core'
import { Headings } from '../@types'

type Props = {
  headings: Headings
  activeItemIds: string[]
}
const Toc: React.FC<Props> = ({ headings, activeItemIds }) => {
  return (
    <Location>
      {({ location }) => (
        <div css={styles.container}>
          <ul css={styles.list_wrapper}>
            {headings.map(item => (
              <li css={styles.list} key={item.id} style={{ marginLeft: `${(item.depth - 2) * 12}px` }}>
                <Link to={`${location.pathname}#${item.id}`} css={activeItemIds.includes(item.id) ? styles.active : ''}>
                  {item.value}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Location>
  )
}

export default Toc

const styles = {
  container: css`
    font-size: 14px;
  `,

  list_wrapper: css`
    list-style: none;
    margin-top: 0;
  `,

  list: css`
    margin-bottom: 1px;
    margin-left: 12px;
    a {
      display: block;
      padding-left: 2px;
      box-shadow: none;
      color: #aaa;
      border-radius: 4px;
      background-color: white;
      letter-spacing: 0; // 幅が狭いので詰め詰めにする

      &:hover {
        background: #fee;
        text-decoration: underline #cbb;
        color: #000;
        transition: background-color 0.2s ease-out;
      }
    }
  `,

  active: css`
    background-color: #fffbf0;
    color: #888;
    transition: background-color 0.2s ease-out;
  `,
}
