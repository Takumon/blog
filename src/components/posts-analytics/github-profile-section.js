import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import GitHubCalendar from 'react-github-calendar'
import ReactTooltip from 'react-tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope  } from '@fortawesome/free-regular-svg-icons'
import { faLink, faMapMarkerAlt, faStar, faCodeBranch  } from '@fortawesome/free-solid-svg-icons'

import styles from './github-profile-section.module.scss'


const GitHubProfile = () => {
  const {
    github: {
      viewer,
      user: { pinnedItems }
    },
  } = useStaticQuery(
    graphql`
      query {
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


  console.log(pinnedItems, viewer)

  return (
    <>
      <h2 className={styles.title}>GitHub Profile</h2>

      <div className={styles.container}>
        <div className={styles.container__info + ' ' + styles.profile}>

          <img className={styles.profile__avatar} src={viewer.avatarUrl} />
          <div className={styles.profile__username}>{viewer.name}</div>

          <div className={styles.divider} ></div>

          <div className={styles.userInfo}>
            <div className={styles.userInfo__content}>
              <FontAwesomeIcon
                color="#333"
                size="sm"
                className={styles.userInfo__content__icon}
                icon={faEnvelope}
              />
              {viewer.email}
            </div>
            <div className={styles.userInfo__content}>
              <FontAwesomeIcon
                color="#333"
                size="sm"
                className={styles.userInfo__content__icon}
                icon={faLink}
              />
              {viewer.websiteUrl}
            </div>
            <div className={styles.userInfo__content}>
              <FontAwesomeIcon
                color="#333"
                size="sm"
                className={styles.userInfo__content__icon}
                icon={faMapMarkerAlt}
              />
              {viewer.location}
            </div>
          </div>


          <div className={styles.divider} ></div>

          <div className={styles.subtitle} >Organizations</div>
          <div className={styles.profile__orgs + ' ' + styles.orgs}>
            {viewer.organizations.nodes.map(n => {
              return (
                <a key={n.avatarUrl} className={styles.orgs__content} href={n.url} >
                  <img src={n.avatarUrl} className={styles.orgs__content__icon} />
                </a>
              )
            })}
          </div>

          <div className={styles.divider} ></div>

        </div>


        <div className={styles.container__main}>

          <div className={styles.subtitle} >Repositories</div>

          <div className={styles.repos} >
            {pinnedItems.nodes.map((repo, i) => (
              <a className={styles.repo} href={repo.url} key={i}>
                
                <div className={styles.repo__name} >
                  <div className={styles.repo__name__inner}>
                    {repo.owner.login}/{repo.name}
                  </div>
                </div>
                
                <div className={styles.repo__description}>
                  {repo.description}
                </div>
                
                <div className={styles.repo__info}>
                  
                  <div className={styles.repo__info__factor} >
                    <FontAwesomeIcon
                      color="#333"
                      size="sm"
                      className={styles.repo__info__icon}
                      icon={faStar}
                    />
                    {repo.stargazers.totalCount}
                  </div>

                  <div className={styles.repo__info__factor} >
                    <FontAwesomeIcon
                      color="#333"
                      size="sm"
                      className={styles.repo__info__icon}
                      icon={faCodeBranch}
                    />
                    {repo.forkCount}
                  </div>
                </div>
              </a>
            ))} 
          </div>

          <GitHubCalendar
            username="takumon"
            years={[2020, 2019]}
            fullYear={false}
            fontSize={10}
          >
            <ReactTooltip
              delayShow={30}
              html
            />
          </GitHubCalendar>
        </div>
      </div>

    </>
  )
}

export default GitHubProfile