require('dotenv').config()
const { setPreBodyComponents } = require("react-dom/server")
const React = require('react');

exports.replaceRenderer = ({ setPreBodyComponents }) => {
  setPreBodyComponents([
    <noscript>本ブログはJavaScriptが前提となっております。JavaScriptを有効にしてください。</noscript>
  ])
}


// exports.onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
//   return setHeadComponents([
//     <script
//       async
//       type="text/javascript"
//       src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
//     />,
//     <script
//       key={`gatsby-plugin-google-adsense`}
//       dangerouslySetInnerHTML={{
//         __html: `
//         (adsbygoogle = window.adsbygoogle || []).push({
//             google_ad_client: "ca-pub-4130341330332844",
//             enable_page_level_ads: true
//         });
//         `
//       }}
//     />
//   ]);
// };