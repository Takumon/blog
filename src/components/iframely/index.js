import React from 'react';
import Helmet from 'react-helmet';


export default function Iframely() {

  return (
      <Helmet>
        <script type="text/javascript" src="//cdn.iframe.ly/embed.js" charset="utf-8" async="async"/>
      </Helmet>
  );
}