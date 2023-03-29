---
title: 'Gatsbyビルドエラー「window is not defined」への対処法'
date: '2020-05-23T09:00:00.000-07:00'
tags:
  - Gatsby
keywords:
  - Gatsby
slug: /error-about-window-is-not-available-during-server-side-rendering-gatsby
thumbnail: thumbnail/2020/05/error-about-window-is-not-available-during-server-side-rendering-gatsby.png
---

## なにこれ

[react-cytoscape](https://github.com/plotly/react-cytoscapejs)のようなwindowオブジェクトを前提としたライブラリをGatsbyで使おうとすると、`gatsby develop`のときは正常動作するにもかかわらず、ビルド時にだけ`window is not defined`エラーがでます。今回はその対処法を備忘録として残しておきます。

## 原因と対処法

Gatsbyビルド時は、`window`や`document`といったブラウザのグローバルオブジェクトを参照しているとエラーになります。
この場合、それらがundefinedかチェックが必要です。

```js
// (Before) 以下でビルド時にエラーが出る場合は...
const module = require("module") 

// (After 1) このようにwindowオブジェクトの存在チェックをすることでエラーを免れます
if (typeof window !== `undefined`) {
  const module = require("module")
}

// (After 2) このような形でもOKです
const module = typeof window !== `undefined` ? require("module") : null
```
<br />


またwebpackの設定で、ビルドエラーになるライブラリをダミーに置き換えることで、エラーを免れます。

```js
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-cytoscapejs/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
```
<br />

さらに、そのライブラリを使った処理をReactコンポーネントに記述している場合は、`componentDidMount`か`useEffect`に移しましょう。そうすることで、その処理がブラウザでのみ実行されるようになるのでビルド時のエラーを免れます。

```js{15}
import CytoscapeComponent from 'react-cytoscapejs'

class PostRelationSection extends React.Component {

  /*--中略--*/

  componentDidMount() {
    const { posts, allImage } = this.props
    const nodes = createPostNode({ posts, allImage })
    nodes.push(CYTOSCAPE_ZOOM_UP_ELEMENT)
    nodes.push(CYTOSCAPE_ZOOM_DOWN_ELEMENT)

    const edges = createPostEdges({posts})

    const cytoscapeElements = CytoscapeComponent.normalizeElements({ nodes, edges })

    this.setState({ cytoscapeElements })
  }

  /*--中略--*/
}
```

## 参考

- [Debugging HTML Builds | GatsbyJS](https://www.gatsbyjs.org/docs/debugging-html-builds/)
- [Window is not defiend · Issue #309 · gatsbyjs/gatsby](https://github.com/gatsbyjs/gatsby/issues/309)


