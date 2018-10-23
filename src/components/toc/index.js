import React from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import styles from './index.module.scss';

class Toc extends React.Component {
  render() {
    const {tableOfContents} = this.props;

    return (
      <div  className={styles.content} dangerouslySetInnerHTML={{ __html: tableOfContents }}></div>
    );
  }
}


export default Toc;
