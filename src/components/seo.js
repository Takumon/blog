import React from 'react'
import Helmet from 'react-helmet'

import * as config from '../config/blog-config.js';

export default function Seo({
  isRoot,
  title,  // not required
  description, // not required
  postUrl, // not required
  postDate, // not required
}) {
  const type = isRoot ? 'website' : 'article';

  const schemaOrgJSONLD = createJSONLD({
    isRoot,
    title,
    description,
    postUrl,
    postDate,
  });

  return(
    <Helmet>
      {/* General tags */}
      <meta name="description" content={description || config.blogDescription} />
      <meta name="image" content={config.blogImageUrl} />

      {/* Schema.org tags */}
      <script type="application/ld+json">{JSON.stringify(schemaOrgJSONLD)}</script>

      {/* OpenGraph tags */}
      <meta property="og:title" content={title || config.blogTitle} />
      <meta property="og:description" content={description || config.blogDescription} />
      <meta property="og:url" content={config.blogUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={config.blogTitle} />
      <meta property="og:image" content={config.blogImageUrl} />

      {/* OpenGraph tags for facebook */}
      <meta property="fb:app_id" content={config.facebookAppId} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content={`@${config.blogAuthorTwitterUserName}`} />
    </Helmet>
  )
}


function createJSONLD({
  isRoot,
  title,  // not required
  description, // not required
  postUrl, // not required
  postDate, // not required
}) {
  const result = [
    {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      url: config.blogUrl,
      name: title,
      alternateName: config.blogTitle,
    },
  ];
  if (!isRoot) {
    result.push({
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': postUrl,
              name: title,
              image: config.blogImageUrl,
            },
          },
        ],
    }),
    result.push({
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        url: config.blogURL,
        name: title,
        alternateName: config.blogTitle,
        headline: title,
        image: {
          '@type': 'ImageObject',
          url: config.blogImageUrl,
        },
        description,
        datePublished: postDate,
        // TODO 更新日を記事のデータとして追加する
        dateModified: postDate,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': config.blogUrl
        },
        author: [
          {
            '@type': 'Person',
            name: config.blogAuthor,
            description: config.blogAuthorDescription,
            image: {
              '@type': 'ImageObject',
              url: config.blogAuthorAvatarUrl,
              width: 60,
              height: 60
            }          },
          {
            '@type': 'thing',
            name: config.blogAuthor,
            sameas: config.blogTitle,
            url: config.blogURL,
            image: {
              '@type': 'ImageObject',
              url: config.blogImageUrl,
              width: 60,
              height: 60
            }
          }
        ],
        publisher: {
          "@type": "Organization",
          "name": "<?php bloginfo('name'); ?>",
          "description":"<?php bloginfo('description'); ?>",
          "logo": {
            "@type": "ImageObject",
            "url": "https://noronoron.com/customize-memo/wp-content/uploads/2017/04/noronoro-favicon-96x96.png",
            "width": 60,
            "height": 60
          }
        }
      });
  };

  return result;
}