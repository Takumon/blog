import React from 'react'
import { Link, graphql } from 'gatsby'
import { get } from 'lodash'
import ClassNames from 'classnames';
import 'katex/dist/katex.min.css';
import rehype from 'rehype'
import visit from 'unist-util-visit'


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
    window.addEventListener('scroll', this.stock, true)
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

    const headerIds = _getHeaderIds(slug, post.tableOfContents);
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
            <ScrollSyncToc className={styles.toc} tableOfContents={post.tableOfContents} headerIds={headerIds} />
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

function _getHeaderIds(slug, tableOfContents) { // 目次のHTML文字列
  const tree = rehype().parse(tableOfContents)
  const result = [];
  visit(tree, 'element', node => {
    if (node.tagName && node.tagName === 'a') {
      result.push(decodeURI(node.properties.href.split('#')[1]));
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
      timeToRead
      tableOfContents
      frontmatter {
        date(formatString: "YYYY/MM/DD")
        title
        tags
      }
    }
  }
`
