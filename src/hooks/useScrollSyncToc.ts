import { useState, useCallback, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import type { Headings, ItemTopOffsets, ActiveItemIds } from '../@types'

/**
 * アクティブなヘッダーの判定用オフセット
 * ヘッダーが画面上部にくるよりちょっと前に目次も変更したい
 */
const OFFSET_ACTIVE_ITEM = 64

const getItemTopOffsetsFromDOM: (headings: Headings) => ItemTopOffsets = (headings) => {
  const result: ItemTopOffsets = []

  headings.forEach(({ id, parents }) => {
    const element = document.getElementById(id)

    if (!element) {
      return
    }

    result.push({
      id,
      offsetTop: element.offsetTop,
      parents,
    })
  })

  return result
}

export default function useScrollSyncToc(headings: Headings): ActiveItemIds {
  const [activeItemIds, setActiveItemIds] = useState<ActiveItemIds>([])
  const [itemTopOffsets, setItemTopOffsets] = useState<ItemTopOffsets>([])

  const calculateItemTopOffsets = useCallback(() => {
    if (window) {
      const newItemTopOffsets = getItemTopOffsetsFromDOM(headings)
      setItemTopOffsets(newItemTopOffsets)
    }
  }, [headings])

  const handleScroll = useDebouncedCallback(() => {
    if (window) {
      const item = itemTopOffsets.find((current, i) => {
        const next = itemTopOffsets[i + 1]

        return next
          ? window.scrollY + OFFSET_ACTIVE_ITEM >= current.offsetTop && window.scrollY + OFFSET_ACTIVE_ITEM < next.offsetTop
          : window.scrollY + OFFSET_ACTIVE_ITEM >= current.offsetTop
      })

      // const newActiveItemIds = item ? (item.parents ? [item.id, ...item.parents.map(i => i.id)] : [item.id]) : []
      const newActiveItemIds = item ? (item.parents ? [item.id, ...item.parents.map((i) => i.id)] : [item.id]) : []

      setActiveItemIds(newActiveItemIds)
    }
  }, 100) // 負荷軽減のため間引く

  const handleResize = useDebouncedCallback(() => {
    if (window) {
      calculateItemTopOffsets()
      handleScroll()
    }
  }, 500) // 負荷軽減のため間引く

  useEffect(() => {
    if (window) {
      calculateItemTopOffsets()
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (window) {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [calculateItemTopOffsets, handleResize, handleScroll])

  return activeItemIds
}
