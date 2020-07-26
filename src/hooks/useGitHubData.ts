import { useStaticQuery, graphql } from 'gatsby'
import { GitHubSectionQuery } from '../../types/graphql-types'

export default function useGitHubData(): GitHubSectionQuery {
  return useStaticQuery<GitHubSectionQuery>(
    graphql`
      query GitHubSection {
        github {
          viewer {
            name
            email
            bio
            url
            avatarUrl
            location
            websiteUrl
            organizations(first: 10) {
              nodes {
                avatarUrl
                url
              }
            }
          }

          user(login: "Takumon") {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on GitHub_Repository {
                  owner {
                    login
                  }
                  name
                  url
                  description
                  stargazers {
                    totalCount
                  }
                  forkCount
                }
              }
            }
          }
        }
      }
    `
  )
}
