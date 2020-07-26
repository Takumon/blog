import React from 'react'
import type { WindowLocation } from "@reach/router"

import Layout from '../components/Layout'
import WordCloudSection from '../components/posts-analytics/WordCloudSection'
import PostRelationSection from '../components/posts-analytics/PostRelationSection'
import GitHubProfile from '../components/posts-analytics/GitHubProfileSection'
import { PageContextAbout } from '../@types'

type Props = {
  location: WindowLocation,
  pageContext: PageContextAbout
}

const AboutTemplate: React.FC<Props> = ({ pageContext: { allPostRelations: posts, wordCloudText, wordCloudTag }, location }) => {
  return (
    <Layout location={location}>
      <GitHubProfile />
      <WordCloudSection wordCloudText={wordCloudText} wordCloudTag={wordCloudTag} />
      <PostRelationSection posts={posts} />
    </Layout>
  )
}

export default AboutTemplate
