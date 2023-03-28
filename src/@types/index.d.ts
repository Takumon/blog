declare module 'gatsby-plugin-dark-mode'

interface PageInput {
  path: string
  component: string
  layout?: string
  context?: any
}

interface ActionCreators {
  createPage: (page: PageInput) => void
  deletePage: (page: PageInput) => void
  createRedirect: (opts: { fromPath: string; isPermanent?: boolean; redirectInBrowser?: boolean; toPath: string }) => void
}

export type GatsbyCreatePages = (fns: { graphql: any; actions: ActionCreators }) => void

export type QueryResult = {
  thumbnails: {
    edges: Array<{
      node: {
        relativePath: string
      }
    }>
  }
  site: any
  allMarkdownRemark: any
  allQiitaPost: any
}


export type PostNodeWrapper = {
  node: GatsbyTypes.MarkdownRemark
  type: string
  date: Date
}

export type RelatedPostConfigIndex = {
  name: string
  weight: number
}

export type RelatedPostConfig = {
  threshold: number
  includeNewer: boolean
  toLower: boolean
  indices: RelatedPostConfigIndex[]
}

export type OptionalRelatedPostConfig = {
  threshold?: number
  includeNewer?: boolean
  toLower?: boolean
  indices?: RelatedPostConfigIndex[]
}

export type InvertedIndex = {
  index: { [name: string]: { [keyword: string]: GatsbyTypes.MarkdownRemark[] } }
  minWeight: number
  maxWeight: number
  cfg: RelatedPostConfig
}

export type RelatedPostSearchQueryFactor = {
  index: string
  keywords: string[]
}

export type RelatedPostSearchQuery = RelatedPostSearchQueryFactor[]

export type RelatedPostRankingDetail = {
  weight: number
  keyword: string
}

export type RelatedPostRankingDetails = RelatedPostRankingDetail[]

export type RelatedPostRanking = {
  node: GatsbyTypes.MarkdownRemark
  matches: number
  weight: number
  details: RelatedPostRankingDetails
}

export type CalculatedRelatedPostRanking = RelatedPostRanking & {
  avgWeight: number
  totalWeight: number
  threshold: number
  isRelated: boolean
}

export type CalculatedRelatedPostRankings = CalculatedRelatedPostRanking[]

export type RelatedPostRankingMap = {
  [slug: string]: RelatedPostRanking
}

export type PostRelation = {
  node: GatsbyTypes.MarkdownRemark
  relations: CalculatedRelatedPostRankings
}

export type PostRelations = PostRelation[]

export type TempWordCount = {
  text: string
  rawTexts: string[]
  size: number
}

export type TempWordCounts = TempWordCount[]

export type WordCount = {
  text: string
  size: number
}

export type WordCounts = WordCount[]

export type PageContextAbout = {
  allPostRelations: PostRelations
  wordCloudText: string
  wordCloudTag: string
}

export type PageContextTags = {
  nodes: GatsbyTypes.MarkdownRemark[]
  tag: string
  tagCounts: TagData
}

declare module 'cytoscape-cose-bilkent'

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

declare module '*.svg' {
  const content: any
  export default content
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
  parents?: Headings
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
