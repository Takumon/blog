import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Layout from '../components/layout'
import WordCloudSection from '../components/posts-analytics/word-cloud-section'
import PostRelationSection from '../components/posts-analytics/posts-relation-section'
import GitHubProfile from '../components/posts-analytics/github-profile-section'


const AboutTemplate = ({ pageContext, location }) => {
  
  const { 
    allPostRelations: posts,
    wordCloudText,
    wordCloudTag,
  } = pageContext

  return (
    <Layout location={location}>
      <GitHubProfile />
      <WordCloudSection
        wordCloudText={wordCloudText}
        wordCloudTag={wordCloudTag}
      />
      <PostRelationSection posts={posts} />
    </Layout>
  )
}

export default AboutTemplate;
