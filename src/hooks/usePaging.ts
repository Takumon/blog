import { useState, useMemo, useCallback } from 'react'

type Props<T> = {
  list: T[]
  perPage: number
}

type ReturnProps<T> = {
  filtered: T[]
  hasNextPage: boolean
  loadNextPage: () => void
}

export default function usePaging<T>({ list, perPage }: Props<T>): ReturnProps<T> {
  const [pageIndex, setPageIndex] = useState(1)

  const hasNextPage = useMemo(() => {
    return pageIndex * perPage < list.length
  }, [pageIndex, perPage, list.length])

  const loadNextPage = useCallback(() => {
    if (!hasNextPage) {
      return
    }

    setPageIndex((current) => current + 1)
  }, [hasNextPage])

  const filtered = useMemo(() => list.slice(0, pageIndex * perPage), [list, pageIndex, perPage])

  return {
    filtered,
    hasNextPage,
    loadNextPage,
  }
}
