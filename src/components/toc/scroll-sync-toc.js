import React from 'react';
import Toc from './index';
import { throttle } from 'lodash';
import remark from 'remark'
import visit from 'unist-util-visit'
import mdastToString from 'mdast-util-to-string';
import GithubSlugger from 'github-slugger';
const githubSlugger = new GithubSlugger()

/**
 * アクティブなヘッダーの判定用オフセット
 * ヘッダーが画面上部にくるよりちょっと前に目次も変更したい
 */
const OFFSET_ACTIVE_IMTE = 64;

/** ヘッダーの要素名 */
const HEADING = 'heading';

/** ヘッダーにおける最小の深さ（h2タグの時） */
const MIN_HEADER_DEPTH = 2

class ScrollSyncToc extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeItemIds: [],
      itemTopOffsets: [],
    };

    this.calculateItemTopOffsets = this.calculateItemTopOffsets.bind(this);
    this.handleResize = throttle(this.handleResize.bind(this), 500) // 負荷軽減のため間引く
    this.handleScroll = throttle(this.handleScroll.bind(this), 100) // 負荷軽減のため間引く
  }

  componentDidMount() {
    this.calculateItemTopOffsets();

    window.addEventListener(`resize`, this.handleResize);
    window.addEventListener(`scroll`, this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this.handleResize);
    window.removeEventListener(`scroll`, this.handleScroll);
  }

  calculateItemTopOffsets() {
    const { rawMarkdownBody } = this.props;

    this.setState({
      itemTopOffsets: _getElementTopOffsetsById(_getToc(rawMarkdownBody)),
    });
  }

  handleResize() {
    this.calculateItemTopOffsets();
    this.handleScroll();
  }

  handleScroll() {
    const { itemTopOffsets } = this.state;
    const item = itemTopOffsets.find((current, i) => {
      const next = itemTopOffsets[i + 1]

      return next
        ? window.scrollY + OFFSET_ACTIVE_IMTE >= current.offsetTop &&
            window.scrollY + OFFSET_ACTIVE_IMTE < next.offsetTop
        : window.scrollY + OFFSET_ACTIVE_IMTE >= current.offsetTop;
    })

    const activeItemIds =
      item
        ? item.parents
          ? [item.id, ...item.parents.map(i => i.id)]
          : [item.id]
        : [];

    this.setState({activeItemIds});
  }

  render() {
    const { activeItemIds } = this.state;
    return <Toc activeItemIds={activeItemIds} {...this.props} />;
  }
}


// マークダウン文字列から目次情報を取得する
function _getToc(rawMarkdownBody) {
  const headings = _extractToc(rawMarkdownBody);
  return _attachParents(headings)
}

// マークダウン文字列から目次情報を抽出する
function _extractToc(rawMarkdownBody) {
  githubSlugger.reset();

  const result = []
  const ast = remark().parse(rawMarkdownBody);
  visit(ast, HEADING, child => {
    if(!child.children[0].value) {
      console.log(child)
    }
    const value = child.children[0].value
    const id = githubSlugger.slug(value || mdastToString(child))
    const depth = child.depth
    result.push({
      value,
      id,
      depth
    })
  })

  return result
}




// ヘッダーに親ヘッダーの参照配列をつける
function _attachParents(headings) {
  // いったん逆にする
  // 下から操作して、子に親の参照を持たせる
  headings.reverse()
  const result = headings.map((h, i) => {
    const lastIndex = headings.length -1
    if (i === lastIndex) {
      return h;
    }

    let currentDepth = h.depth

    for (let targetIndex = i + 1; targetIndex <= lastIndex; targetIndex++) {
      // 最も大きいヘッダの場合は、親は存在しないので捜査終了
      if (currentDepth === MIN_HEADER_DEPTH) {
        break;
      }

      const targetH = headings[targetIndex]

      // (パターン1)今よりも小さければ親なので親配列に追加
      if (currentDepth > targetH.depth) {
        if (h.parents) {
          h.parents.push(targetH)
        } else {
          h.parents = [targetH]
        }
        // 深さに親の深さを設定に捜査継続
        currentDepth = targetH.depth
      } else {
        // (パターン2)今よりも大きければ、その先に親がある可能性があるので
        // 深さはそのままで捜査継続

        // (パターン3)同じであれば兄弟なので、その先に親がある可能性があるので
        // 深さはそのままで捜査継続
      }
    }
    return h
  });

  // 逆なので戻してからreturn
  return result.reverse()
}

const _getElementTopOffsetsById = ids => {
  return ids
    .map(({value, id, parents}) => {
      const element = document.getElementById(id);
      return element
        ? {
          id,
          offsetTop: element.offsetTop,
          parents
        }
        : null
    })
    .filter(item => item);
};

export default ScrollSyncToc;
