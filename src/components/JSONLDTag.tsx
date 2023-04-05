import React from 'react'
import config from '../config/blog-config'

type Props = {
  isRoot: boolean
  thumbnailSrc: string
  title?: string
  description?: string
  postUrl?: string
  postDate?: string
}

const JSONLDTag: React.FC<Props> = ({ isRoot, title, description, postUrl, postDate }) => {
  const author = [
    {
      '@type': 'Person',
      name: config.blogAuthor,
      description: config.blogAuthorDescription,
      image: {
        '@type': 'ImageObject',
        url: config.blogAuthorAvatarUrl,
        width: 60,
        height: 60,
      },
      url: config.blogUrl,
      sameAs: [config.blogAuthorFacebookUrl, config.blogAuthorTwitterUrl],
    },
    {
      '@type': 'thing',
      name: config.blogAuthor,
      sameas: config.blogTitle,
      url: config.blogUrl,
      image: {
        '@type': 'ImageObject',
        url: config.blogImageUrl,
        width: 60,
        height: 60,
      },
    },
  ]

  const publisher = {
    '@type': 'Organization',
    name: config.blogAuthor,
    description: config.blogAuthorDescription,
    logo: {
      '@type': 'ImageObject',
      url: config.blogAuthorAvatarUrl,
      width: 60,
      height: 60,
    },
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
        '@type': 'SearchAction',
        target: `${config.blogUrl}/search?q={q}`,
        'query-input': 'required name=q',
      },
    },
    ...(isRoot
      ? []
      : [
          {
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
          },
          {
            '@context': 'http://schema.org',
            '@type': 'BlogPosting',
            url: config.blogUrl,
            name: title,
            alternateName: config.blogTitle,
            headline: title,
            image: {
              '@type': 'ImageObject',
              url: config.blogImageUrl,
            },
            description: description || '',
            datePublished: postDate,
            // TODO 更新日を記事のデータとして追加する
            dateModified: postDate,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': config.blogUrl,
            },
            author,
            publisher,
          },
        ]),
  ]

  return <script type="application/ld+json">{JSON.stringify(result)}</script>
}

export default JSONLDTag
