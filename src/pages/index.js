import React from 'react'
import { graphql } from 'gatsby'

import get from 'lodash/get'

import Layout from '../components/layout';
import PostList from '../components/post-list';
import TagList from '../components/tag-list';
import Title from '../components/title';

class BlogIndex extends React.Component {
  render() {
    const posts = get(this, 'props.data.allMarkdownRemark.edges', []);

    return (
      <Layout location={this.props.location}>
        <Title />
        <PostList posts={posts} />
        <TagList posts={posts} />
      </Layout>
    );
  }
}

export default BlogIndex

export const pageQuery = graphql`
  {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY/MM/DD")
            title
            tags
          }
        }
      }
    }
  }
`
