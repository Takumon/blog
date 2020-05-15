import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Layout from '../components/layout'
import WordCloudSection from '../components/posts-analytics/word-cloud-section'
import PostRelationSection from '../components/posts-analytics/posts-relation-section'
import GitHubProfile from '../components/posts-analytics/github-profile-section'


const AboutTemplate = ({ pathContext, location }) => {
  const { images } = useStaticQuery(graphql`
    query {
      images: allFile(filter: {relativePath: {regex: "/^thumbnail/*/"}}) {
        edges {
          node {
            relativePath
            name
            childImageSharp {
              fluid(maxWidth: 300, quality: 30, pngQuality: 30, pngCompressionSpeed: 10) {
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
      <GitHubProfile />
      <WordCloudSection
        wordCloudText={wordCloudText}
        wordCloudTag={wordCloudTag}
      />
      <PostRelationSection
        posts={posts}
        allImage={images}
      />
    </Layout>
  )
}

export default AboutTemplate;
