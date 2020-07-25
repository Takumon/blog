import React from 'react'
import { Location } from '@reach/router'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Headings } from '../@types'

const Container = styled.div`
  font-size: 14px;

  ul {
    list-style: none;
    margin-top: 0;

    li {
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
    }
  }
`

const styles = {
  active: css`
    background-color: #fffbf0;
    color: #888;
    transition: background-color 0.2s ease-out;
  `,
}

type Props = {
  headings: Headings
  activeItemIds: string[]
}
const Toc: React.FC<Props> = ({ headings, activeItemIds }) => {
  return (
    <Location>
      {({ location }) => (
        <Container>
          <ul>
            {headings.map(item => (
              <li key={item.id} style={{ marginLeft: `${(item.depth - 2) * 12}px` }}>
                <Link to={`${location.pathname}#${item.id}`} css={activeItemIds.includes(item.id) ? styles.active : ''}>
                  {item.value}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}
    </Location>
  )
}

export default Toc
