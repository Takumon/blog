import React from 'react';
import Toc from './index';

class ScrollSyncToc extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeItemHash: `NONE`,
      itemTopOffsets: [],
    };

    this.calculateItemTopOffsets = this.calculateItemTopOffsets.bind(this);
    this.handleResize = this.handleResize.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
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
    const { headerIds } = this.props;
    this.setState({
      itemTopOffsets: _getElementTopOffsetsById(headerIds),
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
        ? window.scrollY >= current.offsetTop &&
            window.scrollY < next.offsetTop
        : window.scrollY >= current.offsetTop;
    })

    this.setState({
      activeItemHash: item ? item.hash : `NONE`,
    });
  }

  render() {
    const { activeItemHash } = this.state;
    return <Toc activeHash={activeItemHash} {...this.props} />;
  }
}


const _getElementTopOffsetsById = ids => {
  return ids
    .map(hash => {
      const element = document.getElementById(hash);
      return element
        ? {
          hash,
          offsetTop: element.offsetTop
        }
        : null
    })
    .filter(item => item);
};

export default ScrollSyncToc;
