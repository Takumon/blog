import dotenv from 'dotenv'
import * as React from 'react'
import Layout from './src/components/Layout'
dotenv.config()

export const wrapPageElement = ({ element, props }) => <Layout {...props}>{element}</Layout>

// export const onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
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
