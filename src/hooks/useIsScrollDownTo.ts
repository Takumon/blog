import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export default function useIsScrollDownTo(offset: number): boolean {
  const [isScrollDownTo, setIsScrollDownTo] = useState(false)

  const onScroll = useDebouncedCallback(() => {
    const top = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)

    setIsScrollDownTo(top > offset)
  }, 500)

  useEffect(() => {
    if (window) {
      window.addEventListener('scroll', onScroll, true) // 負荷軽減のため50msecごとにまびく
    }

    return () => {
      if (window) {
        window.removeEventListener('scroll', onScroll, true)
      }
    }
  }, [onScroll])

  return isScrollDownTo
}
