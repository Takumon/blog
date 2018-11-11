
import React from 'react';
import PostPreview from '../post-preview';

import styles from './index.module.scss';

class PostList extends React.Component {

  render() {
    return (
      <div className={styles.content}>
        {this.props.postFields.map(postField =>
          <PostPreview
            key={postField.slug}
            postField={postField}
            />
        )}
      </div>
    );
  }
}

export default PostList;