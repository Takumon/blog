import React, { useState, useCallback, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import Toc from './index'

/**
 * アクティブなヘッダーの判定用オフセット
 * ヘッダーが画面上部にくるよりちょっと前に目次も変更したい
 */
const OFFSET_ACTIVE_ITEM = 64

const _getElementTopOffsetsById = headings => {
  return headings
    .map(({ id, parents }) => {
      const element = document.getElementById(id)
      return element
        ? {
            id,
            offsetTop: element.offsetTop,
            parents,
          }
        : null
    })
    .filter(item => item)
}

const ScrollSyncToc = ({ headings }) => {
  const [activeItemIds, setActiveItemIds] = useState([])
  const [itemTopOffsets, setItemTopOffsets] = useState([])

  const calculateItemTopOffsets = useCallback(
    () => {
      const newItemTopOffsets = _getElementTopOffsetsById(headings)
      setItemTopOffsets(newItemTopOffsets)
    },
    [headings]
  )

  // 負荷軽減のため間引く
  const [handleScroll] = useDebouncedCallback(() => {
    const item = itemTopOffsets.find((current, i) => {
      const next = itemTopOffsets[i + 1]

      return next
        ? window.scrollY + OFFSET_ACTIVE_ITEM >= current.offsetTop && window.scrollY + OFFSET_ACTIVE_ITEM < next.offsetTop
        : window.scrollY + OFFSET_ACTIVE_ITEM >= current.offsetTop
    })

    const newActiveItemIds = item ? (item.parents ? [item.id, ...item.parents.map(i => i.id)] : [item.id]) : []

    setActiveItemIds(newActiveItemIds)
  }, 100)

  // 負荷軽減のため間引く
  const [handleResize] = useDebouncedCallback(() => {
    calculateItemTopOffsets()
    handleScroll()
  }, 500)

  useEffect(
    () => {
      calculateItemTopOffsets()
      window.addEventListener(`resize`, handleResize)
      window.addEventListener(`scroll`, handleScroll)

      return () => {
        window.removeEventListener(`resize`, handleResize)
        window.removeEventListener(`scroll`, handleScroll)
      }
    },
    [calculateItemTopOffsets, handleResize, handleScroll]
  )

  return <Toc activeItemIds={activeItemIds} headings={headings} />
}

export default ScrollSyncToc
