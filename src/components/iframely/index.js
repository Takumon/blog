import React from 'react';
import Helmet from 'react-helmet';


export default class Iframely extends React.Component {

  // 記事ページから古い記事に遷移したときにもロードされるようにする
  componentDidMount () {
    if (window.iframely) {
      window.iframely.load();
    }
  }


  render() {
      return (
        <Helmet>
          <script type="text/javascript" src="https://cdn.iframe.ly/embed.js" charset="utf-8"/>
        </Helmet>
    );
  }

}