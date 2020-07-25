import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'

const Iframely: React.FC = () => {
  // 記事ページから古い記事に遷移したときにもロードされるようにする
  useEffect(() => {
    window?.iframely?.load()
  }, [])

  return (
    <Helmet>
      <script type="text/javascript" src="https://cdn.iframe.ly/embed.js" charset="utf-8" />
    </Helmet>
  )
}

export default Iframely
