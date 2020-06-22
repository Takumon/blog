
import React from 'react';
import PostPreview from '../post-preview';

import styles from './index.module.scss';

const PER_PAGE = 15;

class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
    };
    this.loadNextPage = this.loadNextPage.bind(this);
  }

  hasNextPage() {
    return this.state.page * PER_PAGE < this.props.postFields.length;
  }

  loadNextPage() {
    if (!this.hasNextPage()) {
      return;
    }

    this.setState({
      page: this.state.page + 1,
    })
  }

  render() {
    const { postFields } = this.props;
    const filtered = postFields.slice(0, this.state.page * PER_PAGE);

    return (
      <div className={styles.content}>
        {filtered.map(postField =>
          <PostPreview
            key={postField.slug}
            postField={postField}
            />
        )}
        {this.hasNextPage() ? (
          <div className={styles.pagination_area}>
            <button onClick={this.pagination_button}>Load More</button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default PostList;