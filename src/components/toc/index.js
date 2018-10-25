import React from 'react'

import styles from './index.module.scss';

import rehype from 'rehype'
import visit from 'unist-util-visit'
import toHTML from 'hast-util-to-html'

class Toc extends React.Component {
  render() {
    const {tableOfContents, activeHash} = this.props;
    const reflected = _reflectActiveHash(tableOfContents, activeHash);

    return (
      <div className={`${styles.content} toc-content`} dangerouslySetInnerHTML={{ __html: reflected }}></div>
    );
  }
}

function _reflectActiveHash(tableOfContents, activeHash) {
  const tree = rehype().parse(tableOfContents)
  visit(tree, 'element', node => {
    if (node.tagName && node.tagName === 'a') {
      const hash = decodeURI(node.properties.href.split('#')[1]);
      node.properties.className = hash === activeHash ? 'active' : ''
    }
  })
  return toHTML(tree);
}


export default Toc;
