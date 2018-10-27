import React from 'react'
import { Link, graphql } from 'gatsby'
import { get, throttle } from 'lodash'
import ClassNames from 'classnames';
import 'katex/dist/katex.min.css';
import remark from 'remark'
import visit from 'unist-util-visit'
import mdastToToc from 'mdast-util-toc'
import mdastToHast from 'mdast-util-to-hast'


import config from '../../config/blog-config';
import Title from '../../components/title';
import Layout from '../../components/layout';
import SNSShare from '../../components/sns-share'
import PostMetaInfo from '../../components/post-meta-info'
import Seo from '../../components/seo';
import ScrollSyncToc from '../../components/toc/scroll-sync-toc';
import styles from './index.module.scss';


class BlogPostTemplate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowSnsShare: false
    }
  }

  componentDidMount() {
    this.stock = this.watchCurrentPosition.bind(this);
    window.addEventListener('scroll', throttle(this.stock, 500), true) // 負荷軽減のため50msecごとにまびく
  }

  componentWillUnmount() {
      window.removeEventListener('scroll', this.stock, true)
      this.stock = null;
  }

  watchCurrentPosition() {
    this.setState({isShowSnsShare: this.scrollTop() > 400});
  }

  scrollTop() {
      return Math.max(
          window.pageYOffset,
          document.documentElement.scrollTop,
          document.body.scrollTop);
  }


  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const { previous, next, slug } = this.props.pageContext
    const postUrl = `${config.blogUrl}${slug}`;


    const classNameSnsShare = ClassNames({
      [`${styles.sns_share}`] : true,
      [`${styles.sns_share_show}`]: this.state.isShowSnsShare,
      [`${styles.sns_share_hide}`]: !this.state.isShowSnsShare,
    });


    const toc = _getToc(JSON.parse(JSON.stringify(post.headings)), post.rawMarkdownBody)
    return (
      <Layout location={this.props.location}>
        <article>
          <Title postTitle={post.frontmatter.title} />
          <Seo
            isRoot={false}
            title={`${post.frontmatter.title} | ${siteTitle}`}
            description={post.excerpt}
            postUrl={postUrl}
            postDate={post.frontmatter.date}
            />

          <div className={styles.header}>
            <div className={styles.header__inner}>
              <div className={styles.header__inner__content}>

                <h4 className={styles.blog_title}>
                  <Link
                    className={styles.blog_title__link}
                    to={'/'} >
                    {config.blogTitle}
                    <i className={styles.blog_title__icon}></i>
                  </Link>
                </h4>

                <a href={postUrl} rel="current" className={styles.post_title}>
                  <h1>
                    {post.frontmatter.title}
                  </h1>
                </a>

                <PostMetaInfo color={`#fff`} frontmatter={post.frontmatter} />
              </div>
            </div>
          </div>

          <div className={styles.container}>
            <div className={styles.post} dangerouslySetInnerHTML={{ __html: post.html }} />
            <ScrollSyncToc className={styles.toc} tableOfContents={post.tableOfContents} headerIds={toc} />
            <div className={classNameSnsShare}>
              <SNSShare
                title={post.frontmatter.title}
                link={postUrl}
                twitterUserName={config.blogAuthorTwitterUserName}
                />
            </div>
            <ul className={styles.paging}>
              <li>
                {
                  previous &&
                  <Link className={styles.link_to_previous} to={previous.fields.slug} rel="prev">
                    ← 古い記事<br/>{previous.frontmatter.title}
                  </Link>
                }
              </li>
              <li>
                {
                  next &&
                  <Link className={styles.link_to_next} to={next.fields.slug} rel="next">
                    新しい記事 →<br/>
                    {next.frontmatter.title}
                  </Link>
                }
              </li>
            </ul>
          </div>
        </article>
      </Layout>
    )
  }
}

function _getToc(headings, rawMarkdownBody) {
  const headerIds = _getHeaderIds(rawMarkdownBody);

  const headingsWithId = headings.map((h, index) => {
    h.id = headerIds[index]
    return h
  })

  // いったん逆にする
  // 下から操作して、子に親の参照を持たせる
  headingsWithId.reverse()
  const headingsWithParents = headingsWithId.map((h, i) => {
    const lastIndex = headingsWithId.length -1
    if (i === lastIndex) {
      return h;
    }

    let currentDepth = h.depth

    for (let targetIndex = i + 1; targetIndex <= lastIndex; targetIndex++) {
      const targetH = headingsWithId[targetIndex]
      // 同じであれば兄弟なので捜査継続
      if(currentDepth === targetH.depth) {
      // 今よりも深ければ親子関係はないので終了
      } else if (currentDepth < targetH.depth) {
        break
      // 今よりも浅ければ親なので親配列に追加
      } else if (currentDepth > targetH.depth) {
        if (h.parents) {
          h.parents.push(targetH)
        } else {
          h.parents = [targetH]
        }
        // 深さに親の深さを設定に捜査継続
        currentDepth = targetH.depth
      }
    }
    return h
  });

  // 逆なので戻してからreturn
  return headingsWithParents.reverse()
}

function _getHeaderIds(rawMarkdownBody) {
  const ast = remark().parse(rawMarkdownBody);
  const tocAst = mdastToHast(mdastToToc(ast).map)
  const result = [];
  visit(tocAst, 'element', node => {
    if (node.tagName && node.tagName === 'a') {
      const headerName = node.children[0].value
      const headerId = decodeURI(node.properties.href.split('#')[1])
      result.push(headerId)
    }
  })
  return result;
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      excerpt
      rawMarkdownBody
      headings {
        depth
        value
      }
      tableOfContents
      frontmatter {
        date(formatString: "YYYY/MM/DD")
        title
        tags
      }
    }
  }
`
