import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import get from 'lodash/get'
import striptags from 'striptags'


import config from '../../config/blog-config';
import SNSShare from '../../components/sns-share'
import PostMetaInfo from '../../components/post-meta-info'
import Seo from '../../components/seo';
import styles from './index.module.scss';


class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const { previous, next, slug } = this.props.pathContext
    const postUrl = `${config.blogUrl}${slug}`;

    return (
      <article itemScope itemType="http://schema.org/BlogPosting">
        <div className="headerContainer_post">
          <div className="headerContainer_post__content">

            <h4 className={styles.blog_title}>
              <Link
                className={styles.blog_title__link}
                to={'/'} >
                {config.blogTitle}
                <i className={styles.blog_title__icon}></i>
              </Link>
            </h4>

            <a href={postUrl} rel="current" className={styles.post_title}>
              <h1　itemProp="name" >
                {post.frontmatter.title}
              </h1>
            </a>

            <PostMetaInfo post={post.frontmatter} />
          </div>
        </div>


        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        <Seo
          isRoot={false}
          title={`${post.frontmatter.title} | ${siteTitle}`}
          description={sumarrize(post.html)}
          postUrl={postUrl}
          postDate={post.frontmatter.date}
          />

        <div className={styles.content} dangerouslySetInnerHTML={{ __html: post.html }} />

        <footer className={styles.footer}>
          <SNSShare
            title={post.frontmatter.title}
            link={postUrl}
            twitterUserName={config.blogAuthorTwitterUserName}
            />
          <ul className={styles.footer__paging}>
            <li>
              {
                previous &&
                <Link to={previous.fields.slug} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              }
            </li>
            <li>
              {
                next &&
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              }
            </li>
          </ul>
        </footer>

      </article>
    )
  }
}

/**
 * ブログ記事から冒頭120字を取得.<br>
 * 120文字以上の場合は末尾に...をつける.
 *
 * @param {*} html ブログ記事(HTML形式)
 */
function sumarrize(html) {
  const postContent = striptags(html).replace(/\r?\n/g, '').trim();
  return postContent.length <= 120
    ? postContent
    : postContent.slice(0, 120) + '...';
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        date(formatString: "YYYY/MM/DD")
        title
        tags
      }
    }
  }
`
