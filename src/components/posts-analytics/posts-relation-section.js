import React, { useState, useEffect } from 'react'
import cytoscape from 'cytoscape'
import CytoscapeComponent from 'react-cytoscapejs'
import coseBilkent from 'cytoscape-cose-bilkent'
import Fullscreen from "react-full-screen"
import * as config from '../../config/blog-config.js'


cytoscape.use( coseBilkent )


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
  gravity: 0.20,
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
  initialEnergyOnIncremental: 0.5
};


const CYTOSCAPE_COMPONENT_STYLE_SHEET = [
  {
    selector: 'node[id != "zoomUp"][ id != "zoomDown" ]',
    style: {
      'label': 'data(title)',
      'background-image': 'data(backgroudImage)',
      'shape': 'rectangle',
      'padding': '0px',
      'text-outline-width': '2px',
      'text-outline-color': 'white',
      'text-outline-opacity': '1',
      'text-margin-x': '-300px',
      'text-margin-y': '-1',
      'text-valign': 'top',
      'text-halign': 'right',
      'font-weight': 'bold',
      'text-max-width': '300px',
      'text-wrap': 'wrap',
      'font-size': '25px',
      'border-width': '0.2px',
      'border-style': 'solid',
      'border-color': 'gray',
      'width': '300px',
      'height': '166px',
      'color': 'black',
      'background-fit': 'contain',
    },
  },
  {
    selector: 'node[id = "zoomUp"]',
    style: {
      'label': '+',
      'shape': 'round-rectangle',
      'width': '150px',
      'height': '150px',
      'border-color': 'gray',
      'color': 'green',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '150px',
      'font-weight': 'bold',
    },
  },
  {
    selector: 'node[id = "zoomDown"]',
    style: {
      'label': '-',
      'shape': 'round-rectangle',
      'width': '150px',
      'height': '150px',
      'border-color': 'gray',
      'color': 'green',
      'text-valign': 'center',
      'text-halign': 'center',
      'font-size': '150px',
      'font-weight': 'bold',
    },
  },
  {
    selector: 'edge', 
    style: {
      'label': 'data(keyword)', // タグ名
      'width': 'data(width)', // 重みによって太さを変える
      // 'line-color': 'data(color)', // タグ名事に色を変える
      'curve-style': 'bezier',
      // 'edge-distances': 'control-point-weight',
      'line-cap': 'round',
      'text-background-color': '#f1f1f1',
      'text-background-opacity': 1,
      'text-background-shape': 'round-rectangle',
      'text-background-padding': '1px',
      'text-max-width': '300px',
      'text-halign': 'center',
      'text-wrap': 'ellipsis',
      'font-size': 'data(fontSize)',
      'control-point-step-size': 'data(margin)',
      'text-rotation': 'autorotate', // 線に沿わせる
      'color': 'black',
    },
  },
]

const CYTOSCAPE_ZOOM_UP_ELEMENT = {
  data: {
    id: 'zoomUp',
    title: '',
    parent: 'nparent'
  },
  position: {
    x: 0,
    y: 100
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
    parent: 'nparent'
  },
  position: {
    x: 0,
    y: 260
  },
  selected: false,
  selectable: false,
  grabbable: false, 
  locked: true,
}




function createPostNode({posts, allImage}) {

  return posts.map(postRelation => {
    const imageNode = allImage.edges.find(n => {
      return n.node.relativePath.includes(postRelation.node.fields.thumbnail  || config.defaultThumbnailImagePath)
    })

    // 記事サムネイルとして使う
    const backgroudImage = config.blogUrl + imageNode.node.childImageSharp.sizes.src


    const title = postRelation.node.fields.title.replace(/ /g,'')
    let devicedTitle;
    if(title.length > 25) {
      devicedTitle = title.match(/.{25}/g).join('\n')

      const mod = title.length % 25
      if(mod) {
        devicedTitle += '\n' + title.substring(title.length - mod)
      }
    } else {
      devicedTitle = title;
    }
    
    return {
      data: {
        id: postRelation.node.fields.slug, // slug (一意に識別するため)
        title: devicedTitle, // 記事タイトル
        backgroudImage,  // 記事サムネイル
        date: postRelation.node.fields.date,
        href: postRelation.node.fields.slug,
      }
    }
  })
}


function createPostEdges({posts}) {
  
  const result = [];
  posts.forEach(postRelation => {
    postRelation.relations.forEach(({
      details,
      node,
    }) =>
      details.forEach(d => {
        const k = (d.weight / 30) * 1;  
        const newOne = {
          data: {
            source: postRelation.node.fields.slug,
            target: node.fields.slug,
            width: k,
            fontSize: k * 10,
            margin: k * 20,
            keyword: d.keyword,
          }
        }

        // source-targetの重複を除く
        const isContain = result.some(b => {
          const isSameConnection = (newOne.data.source === b.data.source && newOne.data.target === b.data.target) || (newOne.data.target === b.data.source && newOne.data.source === b.data.target)
  
          return isSameConnection
            && newOne.data.width === b.data.width
            && newOne.data.keyword === b.data.keyword
        })
  
        if(!isContain) {
          result.push(newOne)
        }
      })
    )
  })

  return result
}


const graphPaperBackGroundImage = `repeating-linear-gradient(to bottom,
  transparent 21px,
  rgba(225, 225, 225, 0.17) 22px,  rgba(225, 225, 225, 0.17) 22px,
  transparent 23px,  transparent 43px, 
  rgba(225, 225, 225, 0.17) 44px,  rgba(225, 225, 225, 0.17) 44px,
  transparent 45px,  transparent 65px, 
  rgba(225, 225, 225, 0.17) 66px,  rgba(225, 225, 225, 0.17) 66px,
  transparent 67px,  transparent 87px, 
  rgba(225, 225, 225, 0.17) 88px,  rgba(225, 225, 225, 0.17) 88px,
  transparent 89px,  transparent 109px, 
  rgba(225, 225, 225, 0.17) 110px,  rgba(225, 225, 225, 0.17) 110px),
repeating-linear-gradient(to right,
  transparent 21px,
  rgba(225, 225, 225, 0.17) 22px,  rgba(225, 225, 225, 0.17) 22px,
  transparent 23px,  transparent 43px, 
  rgba(225, 225, 225, 0.17) 44px,  rgba(225, 225, 225, 0.17) 44px,
  transparent 45px,  transparent 65px, 
  rgba(225, 225, 225, 0.17) 66px,  rgba(225, 225, 225, 0.17) 66px,
  transparent 67px,  transparent 87px, 
  rgba(225, 225, 225, 0.17) 88px,  rgba(225, 225, 225, 0.17) 88px,
  transparent 89px,  transparent 109px, 
  rgba(225, 225, 225, 0.17) 110px,  rgba(225, 225, 225, 0.17) 110px)`



const PostRelationSection = ({ posts, allImage }) => {
  const [ isFull, setIsFull ] = useState(false)
  const [ cytoscapeElements, setCytoscapeElements ] = useState(null)

  const goFull = () => setIsFull(true)
  const goNotFull = () => setIsFull(false)

  useEffect(() => {
    console.log("hogege")
    const nodes = createPostNode({ posts, allImage })
    nodes.push(CYTOSCAPE_ZOOM_UP_ELEMENT)
    nodes.push(CYTOSCAPE_ZOOM_DOWN_ELEMENT)
    const edges = createPostEdges({posts})
    const cytoscapeElements = CytoscapeComponent.normalizeElements({ nodes, edges })
    setCytoscapeElements(cytoscapeElements)
  }, [posts, allImage])


  let zoomLevel = 0.3
  const deltaZoomLevel = 0.02

  const fullscreenButton =
    isFull 
      ? <button onClick={goNotFull} style={{cursor: 'pointer'}}>戻る</button>
      : <button onClick={goFull} style={{cursor: 'pointer'}}>フルスクリーン表示</button>

  return (
    <>
      <h2 style={{
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        記事関連度マップ
      </h2>
      <div style={{
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '64px',
      }}>
        記事毎のタグ・キーワードをもとに関連度合いをCytoscape.jsで可視化したものです。Canvasで描画していますが、記事をクリックして記事に遷移できたりします。
        マウスホイールで拡大率を変更できます。マップの左上の+-ボタンでも変更できます。
      </div>

      <Fullscreen
        enabled={isFull}
        onChange={isFull => setIsFull(isFull)}
      >
        {!cytoscapeElements
          ? (
            <div style={{
              width: '90%',
              textAlign: 'center',
              fontSize: '2rem',
              color: '#555555',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '42px',
              border: '1px solid black',
              'backgroundColor' : '#ffffff',
              'backgroundImage' : graphPaperBackGroundImage,
              minHeight: '40vh',
              lineHeight: '40vh',
            }}>Now loading...</div>
          )
          : (
          <>
            <div style={{
              width: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '-34px',
              zIndex: 1,
              position: 'relative',
            }}>
              {fullscreenButton}
            </div>
            <CytoscapeComponent
              zoom={zoomLevel}
              pan={{
                x: 100,
                y: 100 
              }}
              minZoom={0.1}
              maxZoom={4}
              elements={cytoscapeElements}
              layout={CYTOSCAPE_COMPONENT_LAYOUT}
              style={{
                width: isFull ? '100vw' : '90%',
                height: '100vh',
                position: 'relative',
                marginLeft: 'auto',
                marginRight: 'auto',
                border: '1px solid black',
                'backgroundColor' : '#ffffff',
                'backgroundImage' : graphPaperBackGroundImage,
              }}
              stylesheet={CYTOSCAPE_COMPONENT_STYLE_SHEET}
              cy={cy => {
                cy.on('click', 'node[id = "zoomUp"]', function (e) {
                  if(zoomLevel < 4) {
                    zoomLevel = zoomLevel + deltaZoomLevel
                  }

                  cy.zoom({
                    level: zoomLevel,
                    position: e.target.position()
                  });
                });

                cy.on('click', 'node[id = "zoomDown"]', function (e) {
                  if(zoomLevel > 0.1) {
                    zoomLevel = zoomLevel - deltaZoomLevel
                  }

                  cy.zoom({
                    level: zoomLevel,
                    position: e.target.position()
                  });
                });


                cy.on('tap', 'node[id != "zoomUp"][ id != "zoomDown" ]', function(){
                  try {
                    window.open( this.data('href') );
                  } catch(e) {
                    window.location.href = this.data('href');
                  }
                });
                cy.on('mouseover', 'node[id != "zoomUp"][ id != "zoomDown" ]', function (e) {
                  document.body.style.cursor = 'pointer';
                  e.target.style({
                    'text-margin-x': '-500px',
                    'width': '500px',
                    'height': '270px',      
                  })
                  e.target.connectedEdges().style({
                    'line-color': 'blue',
                    'color': 'blue',
                    'text-max-width': '400px',
                  });
                });

                cy.on('mouseout', 'node[id != "zoomUp"][ id != "zoomDown" ]', function (e) {
                  document.body.style.cursor = 'default';
                  e.target.style({
                    'text-margin-x': '-300px',
                    'width': '300px',
                    'height': '166px', 
                  })
                  e.target.connectedEdges().style({
                    'line-color': 'gray',
                    'color': 'black',
                    'text-max-width': '300px',
                  });
                });
              }}
            />
          </>)
        }
      </Fullscreen>
    </>
  )
}

export default PostRelationSection