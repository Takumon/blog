import React from 'react'
import { Helmet } from 'react-helmet'
import { css } from '@emotion/core'
import {
  FacebookShareButton,
  FacebookIcon,
  GooglePlusShareButton,
  GooglePlusIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGetPocket } from '@fortawesome/free-brands-svg-icons'

type Props = {
  title: string
  link: string
  twitterUserName: string
}

const SNSShare: React.FC<Props> = ({ title, link, twitterUserName }) => {
  return (
    <ul css={styles.content}>
      <Helmet>
        <script type="text/javascript" src="//b.st-hatena.com/js/bookmark_button.js" charset="utf-8" async="async" />
        <script type="text/javascript" src="//widgets.getpocket.com/v1/j/btn.js?v=1" charset="utf-8" async="async" />
      </Helmet>
      <li css={styles.share_button}>
        <FacebookShareButton additionalProps={{ 'aria-label': 'share_facebook' }} url={link}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </li>

      <li css={styles.share_button}>
        <GooglePlusShareButton additionalProps={{ 'aria-label': 'share_googleplus' }} url={link}>
          <GooglePlusIcon size={32} round />
        </GooglePlusShareButton>
      </li>
      <li css={styles.share_button}>
        <LinkedinShareButton additionalProps={{ 'aria-label': 'share_linkedin' }} url={link}>
          <LinkedinIcon title={title} size={32} round />
        </LinkedinShareButton>
      </li>
      <li css={styles.share_button}>
        <TwitterShareButton additionalProps={{ 'aria-label': 'share_twitter' }} title={title} via={twitterUserName} url={link}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </li>
      <li css={styles.share_button}>
        <a
          aria-label="share_pocket"
          css={styles.pocket_icon_link}
          href={`https://getpocket.com/edit?url=${link}&title=${title}`}
          onClick={`window.open(this.href, 'PCwindow', 'width=550, height=350, menubar=no, toolbar=no, scrollbars=yes'); return false;`}
        >
          <FontAwesomeIcon color="#fff" css={styles.pocket_icon} icon={faGetPocket} />
        </a>
      </li>
      <li css={styles.share_button}>
        <a
          aria-label="share_hatena-bookmark"
          href="http://b.hatena.ne.jp/entry/"
          className="hatena-bookmark-button"
          data-hatena-bookmark-layout="touch-counter"
          title="このエントリーをはてなブックマークに追加"
          style={{ boxShadow: 'none' }}
        >
          <img
            src="https://b.st-hatena.com/images/entry-button/button-only@2x.png"
            alt="このエントリーをはてなブックマークに追加"
            width="24"
            height="24"
            style={{ border: 'none' }}
          />
        </a>
      </li>
    </ul>
  )
}

export default SNSShare

const styles = {
  content: css`
    margin: 0;
    padding: 0;
    list-style: none;
    min-height: 50px;
  `,
  share_button: css`
    display: inline-block;
    margin: 0 8px;
  `,

  share_button__svg: css`
    &:hover {
      cursor: pointer;
      opacity: 0.7;
    }
  `,

  pocket_icon_link: css`
    box-shadow: none;
    width: 32px;
    height: 32px;
    background: #f92323;
    display: block;
    border-radius: 16px;
    text-align: center;
    line-height: 34px;
  `,
  pocket_icon: css`
    font-size: 18px;
  `,
}
