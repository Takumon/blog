import React from 'react';
import Helmet from 'react-helmet';
import {
  FacebookShareButton,
  FacebookIcon,
  GooglePlusShareButton,
  GooglePlusIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';
import styles from './index.module.scss';

export default function SNSShare({title, link, twitterUserName}) {

  return (
    <ul className={styles.content}>
      <Helmet>
        <script type="text/javascript" src="//b.st-hatena.com/js/bookmark_button.js" charset="utf-8" async="async" />
      </Helmet>
      <li className={styles.share_button}>
        <FacebookShareButton url={link}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </li>

      <li className={styles.share_button}>
        <GooglePlusShareButton url={link}>
          <GooglePlusIcon size={32} round />
        </GooglePlusShareButton>
      </li>
      <li className={styles.share_button}>
        <LinkedinShareButton url={link}>
          <LinkedinIcon title={title} size={32} round />
        </LinkedinShareButton>
      </li>
      <li className={styles.share_button}>
        <TwitterShareButton title={title} via={twitterUserName} url={link}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </li>

      <li className={styles.share_button}>
        <a
          href="http://b.hatena.ne.jp/entry/"
          className="hatena-bookmark-button"
          data-hatena-bookmark-layout="touch-counter"
          title="このエントリーをはてなブックマークに追加"
          style={{boxShadow: 'none' }}>
          <img
            src="https://b.st-hatena.com/images/entry-button/button-only@2x.png"
            alt="このエントリーをはてなブックマークに追加"
            width="24"
            height="24"
            style={{border: 'none'}} />
        </a>
      </li>
    </ul>
  );
}