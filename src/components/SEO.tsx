import React from 'react'
import { Helmet } from 'react-helmet'
import JSONLDTag from './JSONLDTag'

import config from '../config/blog-config'

type Props = {
  isRoot: boolean
  thumbnailSrc: string
  title?: string
  description?: string
  postUrl?: string
  postDate?: string
}

const SEO: React.FC<Props> = ({ isRoot, thumbnailSrc, title, description, postUrl, postDate }) => {
  const type = isRoot ? 'website' : 'article'
  const image = config.blogUrl + thumbnailSrc
  const twitterCard = 'summary_large_image'

  return (
    <Helmet>
      {/* General tags */}
      <meta name="description" content={description || config.blogDescription} />
      <meta name="image" content={image} />

      {/* Schema.org tags */}
      <JSONLDTag {...{ isRoot, title, description, postUrl, postDate }} />

      {/* OpenGraph tags */}
      <meta property="og:title" content={title || config.blogTitle} />
      <meta property="og:description" content={description || config.blogDescription} />
      <meta property="og:url" content={config.blogUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={config.blogTitle} />
      <meta property="og:image" content={image} />

      {/* OpenGraph tags for facebook */}
      <meta property="fb:app_id" content={config.facebookAppId} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:title" content={title || config.blogTitle} />
      <meta name="twitter:description" content={description || config.blogDescription} />
      <meta name="twitter:site" content={`@${config.blogAuthorTwitterUserName}`} />

      <link rel="canonical" href={postUrl} />
    </Helmet>
  )
}

export default SEO
