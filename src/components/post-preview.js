import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import Link from 'gatsby-link'



class PostPreview extends React.Component {
  render() {
    const post = this.props.post;

    const tagList = post.tags.map(tag => {
      return (
        <div className="tag">
          <Link to={`/tags/${tag}`} className="tag__link">
            {tag}
          </Link>
        </div>
      );
    });

    return (
      <article key={post.path} className="post-preview">
        <h3 className="post-preview__title" >
          <Link className="post-preview__title_link" to={post.path}>
            {post.title}
          </Link>
        </h3>
        <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
        <small className="post-meta-info" >
          <div className="post-meta-info__date">
            <FontAwesomeIcon icon={faCalendarAlt}/>
            {post.date}
          </div>
          <div className="post-meta-info__tags">
            <FontAwesomeIcon icon={faTags}/>
            {tagList}
          </div>
        </small>
      </article>
    );
  }
}

export default PostPreview;