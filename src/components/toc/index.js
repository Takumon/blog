import React from 'react'

import styles from './index.module.scss';

import rehype from 'rehype'
import visit from 'unist-util-visit'
import toHTML from 'hast-util-to-html'

class Toc extends React.Component {
  render() {
    const {tableOfContents, activeItemIds} = this.props;
    const reflected = _reflectActiveHash(tableOfContents, activeItemIds);

    return (
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: reflected }}></div>
    );
  }
}

function _reflectActiveHash(tableOfContents, activeItemIds) {
  const tree = rehype().parse(tableOfContents)
  visit(tree, 'element', (node) => {
    if (node.tagName && node.tagName === 'a') {
      const id = decodeURI(node.properties.href.split('#')[1]);
      node.properties.className = activeItemIds.includes(id) ? styles.active : ''
    }
  })
  return toHTML(tree);
}


export default Toc;
