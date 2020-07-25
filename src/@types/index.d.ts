import * as React from 'react'

export type GoogleProps = {
  client: string
  slot: string
  className?: string
  style?: string
  layout?: string
  layoutKey?: string
  format?: string
  responsive?: string
}

export = Adsense
declare namespace Adsense {
  export class Google extends React.Component<GoogleProps> {}
}

export type Heading = {
  id: string
  value: string
  depth: number
  parents?: Heading[]
}
export type Headings = Heading[]

export type TagCount = {
  text: string
  size: number
}

export type TagCounts = TagCount[]

export type ItemTopOffset = {
  id: string
  offsetTop: number
  parents: Headings
}

export type ItemTopOffsets = ItemTopOffset[]

export type ActiveItemIds = string[]

export type TagDataFactor = {
  text: string
  size: number
}

export type TagData = TagDataFactor[]

export type WordCloudParam = {
  words: TagData
  w: number
  h: number
  fontSizePow: number
  fontSizeZoom: number
  padding: number
}
