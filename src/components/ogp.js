import React from 'react'
import Helmet from 'react-helmet'

import {
  blogTitle,
  blogUrl,
  blogDescription,
  blogImageUrl,
} from '../config/blog-config.js';

export default function Ogp() {
  return(
    <Helmet>
      <meta property="og:url" content={blogUrl} />
      <meta property="og:type" content="blog" />
      <meta property="og:title" content={blogTitle} />
      <meta property="og:description" content={blogDescription} />
      <meta property="og:image" content={blogImageUrl} />
    </Helmet>
  )
}