import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import get from 'lodash/get'
import striptags from 'striptags'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

import tomatoSvg from '../images/tomato.svg';
import {blogTitle} from '../config/blog-config.js';
import SNSShare from '../components/sns-share'
import Seo from '../components/seo';
import config from '../config/blog-config';



class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const { previous, next, slug } = this.props.pathContext
    const postUrl = `${config.blogUrl}${slug}`;

    const tags = post.frontmatter.tags.map(tag => <div style={{
      border: '1px solid #667',
      borderRadius: '0.5em 0 0.5em 0',
      padding: '0.05em 0.75em',
      marginRight: '0.5em',
      fontWeight: 'bold',
      fontSize: '0.75em',
    }}>{tag}</div>)

    return (
      <article itemScope itemType="http://schema.org/BlogPosting">
        <div className="headerContainer_article">
          <div className="headerContainer_article__content">

            <h4 style={{
              textTransform: 'none',
              margin: '0 0 1em',
            }}>
              <Link
                style={{
                  boxShadow: 'none',
                  textDecoration: 'none',
                  color: 'inherit',
                  fontFamily: 'Montserrat',
                }}
                to={'/'}
              >{blogTitle}<i className="footer-icon-github" style={{
                  backgroundImage: `url(${tomatoSvg})`,
                  width: '1em',
                  height: '1em',
                  backgroundRepeat: 'no-repeat',
                  margin: '0 0 0.3em 0.2em',
                }}></i>
              </Link>
            </h4>

            <a href={postUrl} rel="current" className="articleTitle">
              <h1　itemProp="name" >
                {post.frontmatter.title}
              </h1>
            </a>

            <small style={{
                      color: '#667',
                      fontFamily: 'sans-serif',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      margin: '-0.5em 0 0.5em' }}>
              <div itemProp="dateModified" style={{marginRight:'2em', fontSize: '1.1em'}}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{marginRight: '0.5em' }}/>
                {post.frontmatter.date}
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <FontAwesomeIcon icon={faTags} style={{marginRight: '0.5em'}}/>
                {tags}
              </div>
            </small>

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

        <div className="articleContent" dangerouslySetInnerHTML={{ __html: post.html }} />

        <footer className="articleFooter">
          <SNSShare
            title={post.frontmatter.title}
            link={postUrl}
            twitterUserName={config.blogAuthorTwitterUserName}
            />
          <ul
            style={{
              marginTop: '12px',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              listStyle: 'none',
              padding: 0,
            }}
          >
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
