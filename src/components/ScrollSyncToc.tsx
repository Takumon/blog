import React from 'react'
import type { Headings } from '../@types'
import Toc from './Toc'
import useScrollSyncToc from '../hooks/useScrollSyncToc'

type Props = {
  headings: Headings
}

const ScrollSyncToc: React.FC<Props> = ({ headings }) => {
  const activeItemIds = useScrollSyncToc(headings)
  return <Toc activeItemIds={activeItemIds} headings={headings} />
}

export default ScrollSyncToc
