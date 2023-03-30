const { GraphQLString, GraphQLInt, GraphQLObjectType, GraphQLList } = require('gatsby/graphql')
const remark = require('remark')
const visit = require('unist-util-visit')
const mdastToString = require('mdast-util-to-string')
const GithubSlugger = require('github-slugger')
const githubSlugger = new GithubSlugger()

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if (type.name !== `MarkdownRemark`) {
    return {}
  }

  const ParentHeadingType = new GraphQLObjectType({
    name: `MarkdownParentHeadingDetail`,
    fields: {
      value: {
        type: GraphQLString,
        resolve: ({ value }) => value,
      },
      id: {
        type: GraphQLString,
        resolve: ({ id }) => id,
      },
      depth: {
        type: GraphQLInt,
        resolve: ({ depth }) => depth,
      },
    },
  })

  const HeadingType = new GraphQLObjectType({
    name: `MarkdownHeadingDetail`,
    fields: {
      value: {
        type: GraphQLString,
        resolve: ({ value }) => value,
      },
      id: {
        type: GraphQLString,
        resolve: ({ id }) => id,
      },
      depth: {
        type: GraphQLInt,
        resolve: ({ depth }) => depth,
      },
      parents: {
        type: new GraphQLList(ParentHeadingType),
        resolve: ({ parents }) => parents,
      },
    },
  })

  return {
    headingsDetail: {
      type: new GraphQLList(HeadingType),
      resolve: ({ rawMarkdownBody }) => _attachParents(_getHeaders(rawMarkdownBody)),
    },
  }
}

/** ヘッダーの要素名 */
const HEADING = 'heading'

/** ヘッダーにおける最小の深さ（h2タグの時） */
const MIN_HEADER_DEPTH = 2

/**
 * マークダウン文字列からヘッダー情報を抽出する.
 *
 * @param {String} markdownStr マークダウン文字列
 */
function _getHeaders(markdownStr) {
  githubSlugger.reset()

  const result = []
  const ast = remark().parse(markdownStr)
  visit(ast, HEADING, (child) => {
    const value = mdastToString(child)
    const id = githubSlugger.slug(value)
    const depth = child.depth

    result.push({
      value,
      id,
      depth,
    })
  })

  return result
}

/**
 * ヘッダー情報に親ヘッダーの参照を追加
 *
 * @param {*} headers ヘッダー情報
 */
function _attachParents(headers) {
  // いったん逆にする
  // 下から操作して、子に親の参照を持たせる
  headers.reverse()
  const result = headers.map((h, i) => {
    // 親が一つもない場合は空配列
    h.parents = []

    const lastIndex = headers.length - 1
    if (i === lastIndex) {
      return h
    }

    let currentDepth = h.depth

    for (let targetIndex = i + 1; targetIndex <= lastIndex; targetIndex++) {
      // 最も大きいヘッダの場合は、親は存在しないので捜査終了
      if (currentDepth === MIN_HEADER_DEPTH) {
        break
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
  })

  // 逆なので戻してからreturn
  return result.reverse()
}
