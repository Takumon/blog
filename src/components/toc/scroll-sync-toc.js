import React from 'react';
import Toc from './index';
import { throttle } from 'lodash';

/**
 * アクティブなヘッダーの判定用オフセット
 * ヘッダーが画面上部にくるよりちょっと前に目次も変更したい
 */
const OFFSET_ACTIVE_IMTE = 64;

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
    const { headingsDetail } = this.props;

    this.setState({
      itemTopOffsets: _getElementTopOffsetsById(headingsDetail),
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
