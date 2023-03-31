import React from 'react'
import { css } from '@emotion/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRss } from '@fortawesome/free-solid-svg-icons'
import feedlyLogo from '../images/feedly.svg'

import config from '../config/blog-config'

const HeaderAction: React.FC = () => (
  <div css={styles.content}>
    <a aria-label="feedly" css={styles.button} href="https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Ftakumon.com%2Frss.xml" target="blank">
      <img id="feedlyFollow" src={feedlyLogo} alt="follow us in feedly" width="36" height="36" />
    </a>
    <a aria-label="rss" css={styles.button} href={config.blogRssUrl} target="blank">
      <FontAwesomeIcon icon={faRss} />
    </a>
  </div>
)

export default HeaderAction

const styles = {
  content: css`
    display: flex;
    justify-content: flex-end;
    height: 42px;
    position: absolute;
    bottom: 0;
    right: 24px;

    @media screen and (max-width: 580px) {
      z-index: 2;
      height: 36px;
      right: 12px;
      bottom: -42px;
    }
  `,

  button: css`
    text-align: center;
    display: block;
    box-shadow: none;
    margin-left: 12px;
    height: 42px;

    img {
      margin: 0;
    }
    svg {
      color: var(--textLight);
      height: 38px;
      width: 24px !important;
    }

    :hover {
      box-shadow: none;
    }

    @media screen and (max-width: 580px) {
      margin-left: 12px;
      height: 36px;

      img {
        height: 32px;
        width: 32px;
      }
      svg {
        height: 34px;
        width: 20px !important;
      }
    }
  `,

  link_button: css`
    text-align: center;
    display: block;
    height: 36px;
    background-size: contain;
    box-shadow: none;
    color: var(--buttonColor);
    font-weight: 600;
    background: var(--buttonBG);
    border-radius: 18px;
    line-height: 35px;
    padding: 0 16px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);

    &:hover {
      transform: scale(1.02);
      box-shadow: none;
    }
  `,
}
