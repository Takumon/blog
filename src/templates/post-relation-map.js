import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Layout from '../components/layout'
import WordCloudSection from '../components/posts-analytics/word-cloud-section'
import PostRelationSection from '../components/posts-analytics/posts-relation-section'


const PostRelationMapTemplate = ({ pathContext, location }) => (
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

      const { 
        allPostRelations: posts,
        wordCloudText,
        wordCloudTag,
      } = pathContext

      return (
        <Layout location={location}>
          <WordCloudSection
            wordCloudText={wordCloudText}
            wordCloudTag={wordCloudTag}
          />
          <PostRelationSection
            posts={posts}
            allImage={data.images}
          />
        </Layout>
      )
    }}
  />
)

export default PostRelationMapTemplate;
