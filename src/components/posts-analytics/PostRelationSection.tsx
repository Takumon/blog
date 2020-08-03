import React, { useState, useCallback } from 'react'
import cytoscape from 'cytoscape'
import type { ElementDefinition } from 'cytoscape'
import { css } from '@emotion/core'
import CytoscapeComponent from 'react-cytoscapejs'
import coseBilkent from 'cytoscape-cose-bilkent'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsAlt, faCompress } from '@fortawesome/free-solid-svg-icons'
import type { PostRelations } from '../../@types'
import config from '../../config/blog-config'
import useThumbnailSrcMap from '../../hooks/useThumbnailSrcMap'

cytoscape.use(coseBilkent)

const CYTOSCAPE_COMPONENT_LAYOUT = {
  name: 'cose-bilkent',
  // Whether to include labels in node dimensions. Useful for avoiding label overlap
  nodeDimensionsIncludeLabels: false,
  // number of ticks per frame; higher is faster but more jerky
  refresh: 30,
  // Whether to fit the network view after when done
  fit: true,
  // Padding on fit
  padding: 10,
  // Whether to enable incremental mode
  randomize: true,
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: 100000000,
  // Ideal (intra-graph) edge length
  idealEdgeLength: 700,
  // Divisor to compute edge forces
  edgeElasticity: 0.45,
  // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
  nestingFactor: 0.1,
  // Gravity force (constant)
  gravity: 0.2,
  // Maximum number of iterations to perform
  numIter: 2500,
  // Whether to tile disconnected nodes
  tile: true,
  // Type of layout animation. The option set is {'during', 'end', false}
  animate: 'end',
  // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
  tilingPaddingVertical: 400,
  // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
  tilingPaddingHorizontal: 300,
  // Gravity range (constant) for compounds
  gravityRangeCompound: 1.5,
  // Gravity force (constant) for compounds
  gravityCompound: 1.0,
  // Gravity range (constant)
  gravityRange: 3.8,
  // Initial cooling factor for incremental layout
  initialEnergyOnIncremental: 0.5,
}

const CYTOSCAPE_COMPONENT_STYLE_SHEET: cytoscape.Stylesheet[] = [
  {
    selector: 'node[id != "zoomUp"][ id != "zoomDown" ]',
    style: {
      label: 'data(title)',
      'background-image': 'data(backgroundImage)',
      shape: 'rectangle',
      'text-outline-width': '2px',
      'text-outline-color': 'white',
      'text-outline-opacity': 1,
      'text-margin-x': -300,
      'text-margin-y': -1,
      'text-valign': 'top',
      'text-halign': 'right',
      'font-weight': 'bold',
      'text-max-width': '300px',
      'text-wrap': 'wrap',
      'font-size': '25px',
      'border-width': '0.2px',
      'border-style': 'solid',
      'border-color': 'gray',
      width: '300px',
      height: '166px',
      color: 'black',
      'background-fit': 'contain',
    },
  },
  {
    selector: 'node[id = "zoomUp"]',
    style: {
      label: '+',
      shape: 'round-rectangle',
      width: '150px',
      height: '150px',
      'border-color': 'gray',
      color: 'green',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '150px',
      'font-weight': 'bold',
    },
  },
  {
    selector: 'node[id = "zoomDown"]',
    style: {
      label: '-',
      shape: 'round-rectangle',
      width: '150px',
      height: '150px',
      'border-color': 'gray',
      color: 'green',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '150px',
      'font-weight': 'bold',
    },
  },
  {
    selector: 'edge',
    style: {
      label: 'data(keyword)', // タグ名
      width: 'data(width)', // 重みによって太さを変える
      // 'line-color': 'data(color)', // タグ名事に色を変える
      'curve-style': 'bezier',
      // 'edge-distances': 'control-point-weight',
      'line-cap': 'round',
      'text-background-color': '#f1f1f1',
      'text-background-opacity': 1,
      'text-background-shape': 'roundrectangle',
      'text-background-padding': '1px',
      'text-max-width': '300px',
      'text-halign': 'center',
      'text-wrap': 'ellipsis',
      'font-size': 'data(fontSize)',
      'control-point-step-size': 'data(margin)' as any,
      'text-rotation': 'autorotate' as any, // 線に沿わせる
      color: 'black',
    },
  },
]

const CYTOSCAPE_ZOOM_UP_ELEMENT = {
  data: {
    id: 'zoomUp',
    title: '',
    parent: 'nparent',
  },
  position: {
    x: 0,
    y: 100,
  },
  selected: false,
  selectable: false,
  grabbable: false,
  locked: true,
}

const CYTOSCAPE_ZOOM_DOWN_ELEMENT = {
  data: {
    id: 'zoomDown',
    title: '',
    parent: 'nparent',
  },
  position: {
    x: 0,
    y: 260,
  },
  selected: false,
  selectable: false,
  grabbable: false,
  locked: true,
}

const createPostNode = (posts: PostRelations, thumbnailSrcMap: { [path: string]: string }): cytoscape.ElementDefinition[] => {
  return posts.map((postRelation) => {
    const { fields } = postRelation.node

    // 記事サムネイルとして使う
    const backgroundImage = config.blogUrl + thumbnailSrcMap[fields.thumbnail || config.defaultThumbnailImagePath]

    const title = fields.title.replace(/ /g, '')
    let postTitle
    if (title.length > 25) {
      postTitle = title.match(/.{25}/g).join('\n')

      const mod = title.length % 25
      if (mod) {
        postTitle += '\n' + title.substring(title.length - mod)
      }
    } else {
      postTitle = title
    }

    return {
      data: {
        id: fields.slug, // slug (一意に識別するため)
        title: postTitle, // 記事タイトル
        backgroundImage, // 記事サムネイル
        date: fields.date,
        href: fields.slug,
      },
    }
  })
}

function createPostEdges({ posts }: { posts: PostRelations }): ElementDefinition[] {
  const result: ElementDefinition[] = []
  posts.forEach((postRelation) => {
    postRelation.relations.forEach(({ details, node }) =>
      details.forEach((d) => {
        const k = (d.weight / 30) * 1
        const newOne = {
          data: {
            source: postRelation.node.fields.slug,
            target: node.fields.slug,
            width: k,
            fontSize: k * 10,
            margin: k * 20,
            keyword: d.keyword,
          },
        }

        // source-targetの重複を除く
        const isContain = result.some((b) => {
          const isSameConnection =
            (newOne.data.source === b.data.source && newOne.data.target === b.data.target) ||
            (newOne.data.target === b.data.source && newOne.data.source === b.data.target)

          return isSameConnection && newOne.data.width === b.data.width && newOne.data.keyword === b.data.keyword
        })

        if (!isContain) {
          result.push(newOne)
        }
      })
    )
  })

  return result
}

type Props = {
  posts: PostRelations
}

const PostRelationSection: React.FC<Props> = ({ posts }) => {
  const fullScreenHandle = useFullScreenHandle()
  const [cytoscapeElements, setCytoscapeElements] = useState<ElementDefinition[]>([])
  const [isShowContent, setIsShowContent] = useState(false)

  const thumbnailSrcMap = useThumbnailSrcMap()

  const showContent = useCallback(() => {
    setIsShowContent(true)

    const nodes = createPostNode(posts, thumbnailSrcMap)
    nodes.push(CYTOSCAPE_ZOOM_UP_ELEMENT)
    nodes.push(CYTOSCAPE_ZOOM_DOWN_ELEMENT)
    const edges = createPostEdges({ posts })
    const cytoscapeElements = CytoscapeComponent.normalizeElements({ nodes, edges })
    setCytoscapeElements(cytoscapeElements)
  }, [posts, thumbnailSrcMap])

  let zoomLevel = 0.3
  const deltaZoomLevel = 0.02

  const fullscreenButton = fullScreenHandle.active ? (
    <button onClick={fullScreenHandle.exit} style={{ cursor: 'pointer' }}>
      <FontAwesomeIcon color="#333" size="sm" css={styles.icon} icon={faCompress} />
      Back
    </button>
  ) : (
    <button onClick={fullScreenHandle.enter} style={{ cursor: 'pointer' }}>
      <FontAwesomeIcon color="#333" size="sm" css={styles.icon} icon={faArrowsAlt} />
      Go Fullscreen
    </button>
  )

  const ContentAlternative = (
    <div css={styles.alternative}>
      <button onClick={showContent} css={styles.alternative__button}>
        Show Map
      </button>
    </div>
  )

  const ContentLoading = <div css={styles.loading}>Now loading...</div>

  const pan: any = {
    x: 100,
    y: 100,
  }
  const Content = (
    <>
      <div css={styles.fullscreen}>{fullscreenButton}</div>
      <CytoscapeComponent
        zoom={zoomLevel}
        pan={pan}
        minZoom={0.1}
        maxZoom={4}
        elements={cytoscapeElements}
        layout={CYTOSCAPE_COMPONENT_LAYOUT}
        css={styles.container}
        style={{ width: fullScreenHandle.active ? '100vw' : '90%' }}
        stylesheet={CYTOSCAPE_COMPONENT_STYLE_SHEET}
        cy={(cy) => {
          cy.on('click', 'node[id = "zoomUp"]', function (e) {
            if (zoomLevel < 4) {
              zoomLevel = zoomLevel + deltaZoomLevel
            }

            cy.zoom({
              level: zoomLevel,
              position: e.target.position(),
            })
          })

          cy.on('click', 'node[id = "zoomDown"]', function (e) {
            if (zoomLevel > 0.1) {
              zoomLevel = zoomLevel - deltaZoomLevel
            }

            cy.zoom({
              level: zoomLevel,
              position: e.target.position(),
            })
          })

          cy.on('tap', 'node[id != "zoomUp"][ id != "zoomDown" ]', function () {
            try {
              window.open(this.data('href'))
            } catch (e) {
              window.location.href = this.data('href')
            }
          })
          cy.on('mouseover', 'node[id != "zoomUp"][ id != "zoomDown" ]', function (e) {
            document.body.style.cursor = 'pointer'
            e.target.style({
              'text-margin-x': '-500px',
              width: '500px',
              height: '270px',
            })
            e.target.connectedEdges().style({
              'line-color': 'blue',
              color: 'blue',
              'text-max-width': '400px',
            })
          })

          cy.on('mouseout', 'node[id != "zoomUp"][ id != "zoomDown" ]', function (e) {
            document.body.style.cursor = 'default'
            e.target.style({
              'text-margin-x': '-300px',
              width: '300px',
              height: '166px',
            })
            e.target.connectedEdges().style({
              'line-color': 'gray',
              color: 'black',
              'text-max-width': '300px',
            })
          })
        }}
      />
    </>
  )

  return (
    <>
      <h2 css={styles.title}>Posts Relation</h2>
      <div css={styles.description}>
        The relevance is visualized with Cytoscape.js based on tags and keywords for each article. You can click on an article to transition to it and
        change the zoom level with the mouse wheel.
      </div>

      <FullScreen handle={fullScreenHandle}>{!isShowContent ? ContentAlternative : !cytoscapeElements ? ContentLoading : Content}</FullScreen>
    </>
  )
}

export default PostRelationSection

const styles = {
  title: css`
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  `,

  description: css`
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 64px;
  `,

  icon: css`
    margin-right: 8px;
  `,

  alternative: css`
    width: 90%;
    text-align: center;
    font-size: 2rem;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 42px;
    border: 1px solid black;
    background-color: var(--bgLight);
    background-image: var(--graphPaperBG);
    min-height: 40vh;
    line-height: 40vh;
  `,

  alternative__button: css`
    text-align: center;
    height: 36px;
    background-size: contain;
    box-shadow: none;
    color: white;
    font-weight: 600;
    background: var(--buttonBG);
    border-radius: 18px;
    line-height: 35px;
    font-size: 16px;
    padding: 0 16px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);

    &:hover {
      transform: scale(1.02);
    }
  `,

  loading: css`
    width: 90%;
    text-align: center;
    font-size: 2rem;
    color: var(--textLightLittle);
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 42px;
    border: 1px solid black;
    background-color: var(--bgLight);
    background-image: var(--graphPaperBG);
    min-height: 40vh;
    line-height: 40vh;
  `,

  fullscreen: css`
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: -34px;
    z-index: 1;
    position: relative;
  `,

  container: css`
    height: 100vh;
    position: relative;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid black;
    background-color: var(--bgLight);
    background-image: var(--graphPaperBG);
  `,
}
