import React from 'react'
import { Global, css } from '@emotion/react'

const styles = css`
  body {
    /* GlobalStyle typography */
    --textLight: white;
    --textLightLittle: #aaa;
    --textLightLittleLittle: #4a4a4a;
    --text: #444;
    --textHover: #989eb0;
    --title: #444;
    --titleRevert: #fee;

    --bgActive: #fffbf0;
    --bgLight: white;
    --bgLightLittle: #f1f1f1;
    --bgDarkLittle: #d0d0d0;
    --bgHover: #fee;
    --underline: #dadada;
    --underlineDark: gray;
    --underlineHover: #cbb;
    --titleBorder: #ddd;
    --tagBorder: #ccc;
    --blockquoteBorder: hsla(0, 0%, 0%, 0.5);
    --textLink: #d86343;
    /* HighlightStyle */
    --codeText: #657b83;
    --code: #b38383;
    --codeBG: #f3e3b9;
    --codeLineMarker: #f99;
    --codeHighlightBG: #feb;
    --highlightBG: #fdf6e3;
    /* Each components */
    --cardBorder: #ebf2f6;
    --cardBS: 0 0 0 1px rgba(63, 63, 68, 0.05), 0 1px 3px rgba(63, 63, 68, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05);
    /* button */
    --buttonColor: #fff;
    --buttonBG: #f74539;
    --headerBG: linear-gradient(45deg, #bf002a 25%, #fd5210 70%, #ffa711);
    --headerBGMiddle: linear-gradient(45deg, #bf002a 30%, #bf002a 60%, #fd5210 90%, #ffa711);
    --headerBGBase: linear-gradient(45deg, #8a5e5f, #d8bb93);
    --accent: rgb(206, 17, 38);
    --graphPaperBG: repeating-linear-gradient(
        to bottom,
        transparent 21px,
        rgba(225, 225, 225, 0.17) 22px,
        rgba(225, 225, 225, 0.17) 22px,
        transparent 23px,
        transparent 43px,
        rgba(225, 225, 225, 0.17) 44px,
        rgba(225, 225, 225, 0.17) 44px,
        transparent 45px,
        transparent 65px,
        rgba(225, 225, 225, 0.17) 66px,
        rgba(225, 225, 225, 0.17) 66px,
        transparent 67px,
        transparent 87px,
        rgba(225, 225, 225, 0.17) 88px,
        rgba(225, 225, 225, 0.17) 88px,
        transparent 89px,
        transparent 109px,
        rgba(225, 225, 225, 0.17) 110px,
        rgba(225, 225, 225, 0.17) 110px
      ),
      repeating-linear-gradient(
        to right,
        transparent 21px,
        rgba(225, 225, 225, 0.17) 22px,
        rgba(225, 225, 225, 0.17) 22px,
        transparent 23px,
        transparent 43px,
        rgba(225, 225, 225, 0.17) 44px,
        rgba(225, 225, 225, 0.17) 44px,
        transparent 45px,
        transparent 65px,
        rgba(225, 225, 225, 0.17) 66px,
        rgba(225, 225, 225, 0.17) 66px,
        transparent 67px,
        transparent 87px,
        rgba(225, 225, 225, 0.17) 88px,
        rgba(225, 225, 225, 0.17) 88px,
        transparent 89px,
        transparent 109px,
        rgba(225, 225, 225, 0.17) 110px,
        rgba(225, 225, 225, 0.17) 110px
      );
    --bannerBGFilter: brightness(100%);
    --transitionMode: cubic-bezier(0.1, 0.6, 0.58, 1);
  }

  body.dark {
    -webkit-font-smoothing: antialiased;

    --textLightLittle: #aaa;
    --textLightLittleLittle: #b2b2b3;
    --textHover: #a4a3bc;
    --title: #dcdbec;
    --titleRevert: #040404;
    --bgActive: #0e0e0d;
    --bgDarkLittle: #303030;
    --bgHover: #000;
    --underline: #dadada;
    --underlineDark: gray;
    --underlineHover: #cbb;
    --titleBorder: #ddd;
    --tagBorder: #363434;
    --blockquoteBorder: hsla(0, 0%, 0%, 0.5);
    --textLink: #d86343;
    --codeText: #afced8;
    --code: #c2c2c2;
    --codeBG: #26241d;
    --codeLineMarker: #863636;
    --codeHighlightBG: #39362c;
    --highlightBG: #000000;
    --cardBorder: #000000;
    --cardBS: 0 0 0 1px rgb(186 186 199 / 5%), 0 1px 3px rgb(132 132 142 / 10%), 0 1px 2px rgba(0, 0, 0, 0.05);
    --buttonColor: #ffffff;
    --buttonBG: #f74539;
    --headerBG: linear-gradient(45deg, #bf002a 25%, #fd5210 70%, #ffa711);
    --headerBGMiddle: linear-gradient(45deg, #bf002a 30%, #bf002a 60%, #fd5210 90%, #ffa711);
    --headerBGBase: linear-gradient(45deg, #8a5e5f, #d8bb93);
    --accent: rgb(206, 17, 38);
    --bannerBGFilter: brightness(100%) saturate(100%) hue-rotate(-150deg) grayscale(0%);
    --textLight: #3e3939;
    --text: #dcdbec;
    --bgLight: #393841;
    --bgLightLittle: #4a4646;
    --transitionMode: cubic-bezier(0.1, 0.6, 0.58, 1);
  }

  /* アンカーリンク（gatsby-remark-autolink-headersカスタム） */
  h1 .anchor,
  h2 .anchor,
  h3 .anchor,
  h4 .anchor,
  h5 .anchor,
  h6 .anchor {
    box-shadow: none;
  }

  /* 引用 */
  blockquote {
    margin-left: 0;
    margin-right: 0;
    font-size: 1rem;
    padding-left: 1rem;
    border-left: 0.32813rem solid var(--blockquoteBorder);
  }

  /* マークダウンプレビューエリアの画像を左寄せする */
  .gatsby-resp-image-wrapper {
    margin-left: 0 !important;
  }

  /* はてブのアイコン幅をカスタム */
  .hatena-bookmark-button-frame {
    width: 32px !important;
  }

  /* font-awsome初期表示時にアイコンが大きくなるのを防止 */
  .svg-inline--fa {
    height: 1em;
  }
`

const GlobalStyle: React.FC = () => {
  return <Global styles={styles} />
}

export default GlobalStyle
