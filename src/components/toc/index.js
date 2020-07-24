import React from 'react'
import { Location } from '@reach/router'
import { Link } from 'gatsby'

import styles from './index.module.scss'

const Toc = ({ headings, activeItemIds }) => {
  return (
    <Location>
      {({ location }) => (
        <div className={styles.content}>
          <ul>
            {headings.map(item => (
              <li key={item.id} style={{ marginLeft: `${(item.depth - 2) * 12}px` }}>
                <Link to={`${location.pathname}#${item.id}`} className={activeItemIds.includes(item.id) ? styles.active : ''}>
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
