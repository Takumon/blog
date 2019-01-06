const { createFilePath } = require('gatsby-source-filesystem')

const unified = require('unified')
const remarkParse = require('remark-parse')
const remark2rehype = require('remark-rehype')
const rehypeStringify = require('rehype-stringify')
const striptags = require('striptags')



/**
 * Markdown記事とQiita記事のインターフェースを共通化
 */
exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type !== `MarkdownRemark` && node.internal.type !== `QiitaPost`) {
    return
  }


  const [
    slug,
    title,
    date,
    excerpt,
    tags,
    thumbnail,
  ] =
    node.internal.type === `MarkdownRemark`
      ? [
        createFilePath({ node, getNode }),
        node.frontmatter.title,
        node.frontmatter.date,
        _excerptMarkdown(node.rawMarkdownBody, 120),
        node.frontmatter.tags,
        node.frontmatter.thumbnail
      ]
      :[
        `/${node.id}/`,
        node.title,
        node.created_at,
        _excerptHtml(node.rendered_body, 120),
        [...(node.tags.map(tag => tag.name) || []), 'Qiita'], // Qiitaタグを追加
        undefined,
      ]


  createNodeField({ name: `slug`,     node,   value: slug     })
  createNodeField({ name: `title`,    node,   value: title    })
  createNodeField({ name: `date`,     node,   value: date     })
  createNodeField({ name: `excerpt`,  node,   value: excerpt  })
  createNodeField({ name: `tags`,     node,   value: tags     })
  createNodeField({ name: `thumbnail`,node,   value: thumbnail})
}

function _excerptMarkdown(markdown, length) {
  const { contents: html } =
  unified()
    .use(remarkParse)
    .use(remark2rehype)
    .use(rehypeStringify)
    .processSync(markdown)

  return _excerptHtml(html, length)
}

function _excerptHtml(html, length) {
  const postContent = striptags(html).replace(/\r?\n/g, '').trim();
  return postContent.length <= length
    ? postContent
    : postContent.slice(0, length) + '...';
}