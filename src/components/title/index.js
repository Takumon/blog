import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

// 受け取るデータ
//   postTitle (任意) 記事のタイトル
//   tag (任意) 絞り込み検索用タグ
class Title extends React.Component {
  render() {
    const {postTitle, tag} = this.props;
    return (
      <StaticQuery
        query={graphql`
          query LayoutQuery {
            site {
              siteMetadata {
                title
              }
            }
          }
        `}

        render={data =>
          tag
            ? <Helmet title={`${postTitle} | ${tag}`} />
            : postTitle
              ? <Helmet title={`${postTitle} | ${data.site.siteMetadata.title}`} />
              : <Helmet title={`${data.site.siteMetadata.title}`} />
        }
      />
    );
  }
}


export default Title;
