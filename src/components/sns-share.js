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

export default function SNSShare({title, link, twitterUserName}) {
  console.log(title)
  console.log(link)

  return (
    <ul className="sns-share__area">
      <Helmet>
        <script type="text/javascript" src="//b.st-hatena.com/js/bookmark_button.js" charset="utf-8" async="async" />
      </Helmet>
      <li className="sns-share__button">
        <FacebookShareButton url={link}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </li>

      <li className="sns-share__button">
        <GooglePlusShareButton url={link}>
          <GooglePlusIcon size={32} round />
        </GooglePlusShareButton>
      </li>
      <li className="sns-share__button">
        <LinkedinShareButton url={link}>
          <LinkedinIcon title={title} size={32} round />
        </LinkedinShareButton>
      </li>
      <li className="sns-share__button">
        <TwitterShareButton title={title} via={twitterUserName} url={link}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </li>

      <li className="sns-share__button">
        <a
          href="http://b.hatena.ne.jp/entry/"
          className="hatena-bookmark-button"
          data-hatena-bookmark-layout="vertical-normal"
          data-hatena-bookmark-lang="ja"
          title="このエントリーをはてなブックマークに追加"
        >
          <img
            src="//b.st-hatena.com/images/entry-button/button-only@2x.png"
            alt="このエントリーをはてなブックマークに追加"
            width="20"
            height="20"
            style={{border: 'none'}}
          />
        </a>
      </li>
    </ul>
  );
}