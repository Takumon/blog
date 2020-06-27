import React, { useState, useMemo, useCallback } from 'react'
import PostPreview from '../post-preview'

import styles from './index.module.scss'

const PER_PAGE = 15

const PostList = ({ postFields }) => {

  const [pageIndex, setPageIndex] = useState(1)

  const hasNextPage = useMemo(() => {
    return pageIndex * PER_PAGE < postFields.length
  }, [ pageIndex, postFields ])

  const loadNextPage = useCallback(() => {
    if (!hasNextPage) {
      return
    }

    setPageIndex(current => current + 1)
  }, [ hasNextPage ])


  const filtered = useMemo(() => postFields.slice(0, pageIndex * PER_PAGE), [ pageIndex, postFields ])

  return (
    <div className={styles.content}>
      <div className={styles.content_inner} >
        {filtered.map(postField =>
          <PostPreview
            key={postField.slug}
            postField={postField}
            />
        )}
      </div>
      {hasNextPage ? (
        <div className={styles.pagination_area}>
          <button className={styles.pagination_button} onClick={loadNextPage}>Load More</button>
        </div>
      ) : null}
    </div>
  )
}

export default PostList