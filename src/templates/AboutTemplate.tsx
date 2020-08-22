import React from 'react'

import WordCloudSection from '../components/posts-analytics/WordCloudSection'
import PostRelationSection from '../components/posts-analytics/PostRelationSection'
import GitHubProfile from '../components/posts-analytics/GitHubProfileSection'
import { PageContextAbout } from '../@types'

type Props = {
  pageContext: PageContextAbout
}

const AboutTemplate: React.FC<Props> = ({ pageContext: { allPostRelations: posts, wordCloudText, wordCloudTag } }) => {
  return (
    <>
      <GitHubProfile />
      <WordCloudSection wordCloudText={wordCloudText} wordCloudTag={wordCloudTag} />
      <PostRelationSection posts={posts} />
    </>
  )
}

export default AboutTemplate
