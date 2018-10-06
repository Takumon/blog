import React from 'react';
import PostPreview from './post-preview';


class PostList extends React.Component {
  getPosts() {
    return this.props.postEdges.map(postEdge => {
      return {
        path: postEdge.node.fields.slug,
        tags: postEdge.node.frontmatter.tags,
        cover: postEdge.node.frontmatter.cover,
        title: postEdge.node.frontmatter.title,
        date: postEdge.node.frontmatter.date,
        excerpt: postEdge.node.excerpt,
        timeToRead: postEdge.node.timeToRead
      };
    })
  }

  render() {
    return (
      <div className="post-list">
        {this.getPosts().map(post => <PostPreview post={post}></PostPreview>)}
      </div>
    );
  }
}

export default PostList;