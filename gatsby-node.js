const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const _flow = require('lodash/fp/flow')
const _forEach = require('lodash/fp/forEach')
const _uniq = require('lodash/fp/uniq')
const _flatMap = require('lodash/fp/flatMap')
const relatedPost = require('./gatsby-related-post')



const POST_TYPE = {
  ORIGINAL: 'original',
  QIITA: 'qiita'
}


// onCreateNodeより後に実行される
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js');
    const qiitaPost = path.resolve('./src/templates/qiita-post.js');
    const tagPage =  path.resolve('./src/templates/tags.js');

    resolve(
      graphql(
        `
          {
            allMarkdownRemark(sort: { fields: [fields___date], order: DESC }, limit: 1000) {
              edges {
                node {
                  fields {
                    slug
                    title
                    date
                    excerpt
                    tags
                    keywords
                  }
                }
              }
            }
            allQiitaPost(sort: { fields: [fields___date], order: DESC }, limit: 1000) {
              edges {
                node {
                  fields {
                    slug
                    title
                    date
                    excerpt
                    tags
                    keywords
                  }
                  id
                  title
                  rendered_body
                  body
                  comments_count
                  created_at
                  likes_count
                  reactions_count
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }


        // オリジナル記事とQiitaの記事を1つのリストにする
        const originalPosts = result.data.allMarkdownRemark.edges.map(p => {
          return {
            type: POST_TYPE.ORIGINAL,
            date: new Date(p.node.fields.date),
            node: p.node
          }
        })

        const qiitaPosts = result.data.allQiitaPost.edges.map(p => {
          return {
            type: POST_TYPE.QIITA,
            date: new Date(p.node.fields.date),
            node: p.node
          }
        })

        const posts = [...originalPosts, ...qiitaPosts].sort((a,b) => {
          if( a.date < b.date ) return 1
          if( a.date > b.date ) return -1
          return 0
        })

        const allPostNodes = _.map(posts, ({node}) => node)

        // 記事詳細ページ生成
        _.each(posts, ({type, node}, index) => {

          // 最大5つ関連記事を取得
          const relatedPosts = relatedPost.extractRelatedPosts(allPostNodes, node, relatedPost.defaultConfig).slice(0,5)
          const latestPosts = allPostNodes.slice(0,5)

          if (type === POST_TYPE.ORIGINAL) {
            createPage({
              path: node.fields.slug,
              component: blogPost,
              context: {
                slug: node.fields.slug,
                relatedPosts,
                latestPosts,
                ...previouseAndNext(posts, index)
              },
            })

          } else if (type === POST_TYPE.QIITA) {
            createPage({
              path: node.fields.slug,
              component: qiitaPost,
              context: {
                slug: node.fields.slug,
                relatedPosts,
                latestPosts,
                ...previouseAndNext(posts, index)
              },
            })

          } else {
            throw new Error(`Unexpected post type = ${type}`)
          }
        })


        // タグ別一覧ページ生成
        _flow(
          _flatMap(post => post.node.fields.tags),
          _uniq(),
          _forEach(tag => {
            createPage({
              path: `/tags/${_.kebabCase(tag)}/`,
              component: tagPage,
              context: {
                tag
              },
            })
          })
        )(posts)
      })
    )
  })
}


/**
 * 指定したインデックスの記事の前後の記事を取得する.
 *
 * @param {Array} posts 記事一覧
 * @param {int} index 対象記事のインデックス
 */
function previouseAndNext(posts, index) {
  return {
    previous: index === posts.length - 1 ? null : posts[index + 1].node,
    next: index === 0 ? null : posts[index - 1].node
  }
}
