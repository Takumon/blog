import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Layout from '../components/layout'
import WordCloudSection from '../components/posts-analytics/word-cloud-section'
import PostRelationSection from '../components/posts-analytics/posts-relation-section'
import GitHubContributionsSection from '../components/posts-analytics/github-contributions-section'


const PostRelationMapTemplate = ({ pathContext, location }) => {
  const { images } = useStaticQuery(graphql`
    query {
      images: allFile {
        edges {
          node {
            relativePath
            name
            childImageSharp {
              fluid(maxWidth: 100) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  `)
  
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
        allImage={images}
      />
      <GitHubContributionsSection />
    </Layout>
  )
}

export default PostRelationMapTemplate;
