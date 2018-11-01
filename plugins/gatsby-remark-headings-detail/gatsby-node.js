const {
  GraphQLString,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLList,
 } = require('gatsby/graphql')
 const remark = require('remark')
 const visit = require('unist-util-visit')
 const mdastToString = require('mdast-util-to-string')
 const GithubSlugger = require('github-slugger')
 const githubSlugger = new GithubSlugger()


exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if (type.name !== `MarkdownRemark`) {
    return {}
  }



  const HeadingLevels = new GraphQLEnumType({
    name: `LinkHeadingLevels`,
    values: {
      h1: { value: 1 },
      h2: { value: 2 },
      h3: { value: 3 },
      h4: { value: 4 },
      h5: { value: 5 },
      h6: { value: 6 },
    },
  })

  const ParentHeadingType = new GraphQLObjectType({
    name: `MarkdownParentLinkHeadings`,
    fields: {
      value: {
        type: GraphQLString,
        resolve: ({value}) => value,
      },
      id: {
        type: GraphQLString,
        resolve: ({id}) => id,
      },
      depth: {
        type: GraphQLInt,
        resolve: ({depth}) => depth,
      },
    }
  })


  const HeadingType = new GraphQLObjectType({
    name: `MarkdownLinkHeading`,
    fields: {
      value: {
        type: GraphQLString,
        resolve(heading) {
          return heading.value
        },
      },
      id: {
        type: GraphQLString,
        resolve(heading) {
          return heading.id
        },
      },
      depth: {
        type: GraphQLInt,
        resolve(heading) {
          return heading.depth
        },
      },
      parents: {
        type: new GraphQLList(ParentHeadingType),
        resolve(heading) {
          return heading.parents
        },
      },
    },
  })


  return {
    headingsDetail : {
      type: new GraphQLList(HeadingType),
      args: {
        depth: {
          type: HeadingLevels,
        },
      },
      resolve(markdownNode, { depth }) {
        const result = _attachParents(_getHeaders(markdownNode))
        return result
      },
    },
  }
}

/** ヘッダーの要素名 */
const HEADING = 'heading';

/** ヘッダーにおける最小の深さ（h2タグの時） */
const MIN_HEADER_DEPTH = 2


function _getHeaders(markdownNode) {
  githubSlugger.reset();

  const result = []
  const ast = remark().parse(markdownNode.rawMarkdownBody);
  visit(ast, HEADING, child => {
    const value = child.children[0].value
    const id = githubSlugger.slug(value || mdastToString(child))
    const depth = child.depth
    result.push({
      value,
      id,
      depth
    })
  })

  return result
}




// ヘッダーに親ヘッダーの参照配列をつける
function _attachParents(headers) {
  // いったん逆にする
  // 下から操作して、子に親の参照を持たせる
  headers.reverse()
  const result = headers.map((h, i) => {
    // 親が一つもない場合は空配列
    h.parents = []

    const lastIndex = headers.length -1
    if (i === lastIndex) {
      return h;
    }

    let currentDepth = h.depth

    for (let targetIndex = i + 1; targetIndex <= lastIndex; targetIndex++) {
      // 最も大きいヘッダの場合は、親は存在しないので捜査終了
      if (currentDepth === MIN_HEADER_DEPTH) {
        break;
      }

      const targetH = headers[targetIndex]

      // (パターン1)今よりも小さければ親なので親配列に追加
      if (currentDepth > targetH.depth) {
        h.parents.push(targetH)
        // 深さに親の深さを設定に捜査継続
        currentDepth = targetH.depth
      } else {
        // (パターン2)今よりも大きければ、その先に親がある可能性があるので
        // 深さはそのままで捜査継続

        // (パターン3)同じであれば兄弟なので、その先に親がある可能性があるので
        // 深さはそのままで捜査継続
      }
    }
    return h
  });

  // 逆なので戻してからreturn
  return result.reverse()
}
