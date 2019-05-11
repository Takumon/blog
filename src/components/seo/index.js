import React from 'react'
import { StaticQuery, graphql } from "gatsby"
import Helmet from 'react-helmet'

import * as config from '../../config/blog-config.js';

export default function Seo({
  isRoot,
  title,  // not required
  description, // not required
  postUrl, // not required
  postDate, // not required
  largeImage, // not required
}) {
  const type = isRoot ? 'website' : 'article';

  const JSONLDTag = createJSONLDTag({
    isRoot,
    title,
    description,
    postUrl,
    postDate,
  });

  return(
    <StaticQuery
      query={graphql`
        query {
          images: allFile {
            edges {
              node {
                relativePath
                name
                childImageSharp {
                  sizes(maxWidth: 800) {
                    ...GatsbyImageSharpSizes
                  }
                }
              }
            }
          }
        }
      `}

      render={(data) => {
        const imageNode = data.images.edges.find(n => {
          return n.node.relativePath.includes(largeImage);
        });
        
        const image =
          imageNode
            ? config.blogUrl + imageNode.node.childImageSharp.sizes.src
            : config.blogImageUrl
        
        const twitterCard = 
          largeImage
            ? 'summary_large_image'
            : 'summary';

        return (<Helmet>
          {/* General tags */}
          <meta name="description" content={description || config.blogDescription} />
          <meta name="image" content={image} />

          {/* Schema.org tags */}
          {JSONLDTag}

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
        </Helmet>)
      }}
    />
  )
}


function createJSONLDTag({
  isRoot,
  title,  // not required
  description, // not required
  postUrl, // not required
  postDate, // not required
}) {

  const author = [
    {
      '@type': 'Person',
      name: config.blogAuthor,
      description: config.blogAuthorDescription,
      image: {
        '@type': 'ImageObject',
        url: config.blogAuthorAvatarUrl,
        width: 60,
        height: 60
      },
      'url': config.blogUrl,
      "sameAs": [
        config.blogAuthorFacebookUrl,
        config.blogAuthorTwitterUrl,
      ]
    },
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
  ];

  const publisher = {
    '@type': 'Organization',
    name: config.blogAuthor,
    description: config.blogAuthorDescription,
    logo: {
      '@type': 'ImageObject',
      url: config.blogAuthorAvatarUrl,
      width: 60,
      height: 60
    }
  }

  const result = [
    {
      '@context': 'http://schema.org',
      '@type': 'WebSite',
      inLanguage: 'ja',
      url: config.blogUrl,
      name: title,
      alternateName: config.blogTitle,
      image: config.blogImageUrl,
      description: config.blogAuthorDescription,
      author,
      publisher,
      potentialAction: {
        '@type': "SearchAction",
        target: `${config.blogUrl}/search?q={q}`,
        'query-input': 'required name=q'
      }
    }
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
        author,
        publisher,
      });
  };

  return <script type="application/ld+json">{JSON.stringify(result)}</script>;
}