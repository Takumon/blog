import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons'
import Layout from '../components/layout';
import cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
import coseBilkent from 'cytoscape-cose-bilkent';
import Fullscreen from "react-full-screen";

cytoscape.use( coseBilkent );

class PostRelationMapTemplate extends React.Component {
  constructor(props) {
    super();

    this.state = {
      isFull: false,
    };
  }

  goFull = () => {
    this.setState({ isFull: true })
  }

  goNotFull = () => {
    this.setState({ isFull: false })
  }

  render() {

    const layout = {
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

    const stylesheet = [
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

    const { 
      allPostRelations: posts,
      wordCloudText,
      wordCloudTag,
    } = this.props.pathContext

    const wordCloudTextSvg = <div
      dangerouslySetInnerHTML={{__html: wordCloudText}}
      style={{
        width: 1200,
        height: 630,
      }}
    />

    const wordCloudTagSvg = <div
      dangerouslySetInnerHTML={{__html: wordCloudTag}}
      style={{
        width: 1200,
        height: 630,
      }}
    />

    const nodes = posts.map(postRelation => {
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
          backgroudImage: postRelation.node.fields.thumbnail || '/icons/app-sns.png',  // 記事サムネイル
          date: postRelation.node.fields.date,
          href: postRelation.node.fields.slug,
        }
      }
    })

    nodes.push({
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
    })

    nodes.push({
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
    })

    const edges = [];
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
          const isContain = edges.some(b => {
            const isSameConnection = (newOne.data.source === b.data.source && newOne.data.target === b.data.target) || (newOne.data.target === b.data.source && newOne.data.source === b.data.target)
    
            return isSameConnection
              && newOne.data.width === b.data.width
              && newOne.data.keyword === b.data.keyword
          })
    
          if(!isContain) {
            edges.push(newOne)
          }
        })
      )
    })


    const elements = CytoscapeComponent.normalizeElements({
      nodes,
      edges,
    })

    let zoomLevel = 0.3
    const deltaZoomLevel = 0.05


    const fullscreenButton =
      this.state.isFull
       ? <button
          onClick={this.goNotFull}
          >戻る</button>
       : <button
          onClick={this.goFull}
         >フルスクリーン表示</button>

    return (
      <Layout location={this.props.location}>
        
        <h2 style={{
          width: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>WordCloud</h2>
        <div style={{
          width: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '64px',
        }}>
          記事本文とタグをインプットにしてWordCloudを作成しました。
        </div>

        <div style={{
          width: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '64px',
        }}>
          {wordCloudTagSvg}
        </div>

        <div style={{
          width: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '64px',
        }}>
          {wordCloudTextSvg}
        </div>



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
          enabled={this.state.isFull}
          onChange={isFull => this.setState({isFull})}
        >
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
            elements={elements}
            layout={layout}
            style={{
              width: this.state.isFull ? '100vw' : '90%',
              height: '100vh',
              position: 'relative',
              marginLeft: 'auto',
              marginRight: 'auto',
              border: '1px solid black',
              'backgroundColor' : '#ffffff',
              'backgroundImage' : `repeating-linear-gradient(to bottom,
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
                  rgba(225, 225, 225, 0.17) 110px,  rgba(225, 225, 225, 0.17) 110px)`,
            }}
            stylesheet={stylesheet}
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
        </Fullscreen>
      </Layout>
    );
  }
}

export default PostRelationMapTemplate;
