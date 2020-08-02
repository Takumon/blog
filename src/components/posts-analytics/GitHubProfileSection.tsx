import React from 'react'
import { css } from '@emotion/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'
import { faLink, faMapMarkerAlt, faStar, faCodeBranch } from '@fortawesome/free-solid-svg-icons'
import GitHubCalendar from 'react-github-calendar'
import ReactTooltip from 'react-tooltip'
import useGitHubData from '../../hooks/useGitHubData'

const GitHubProfileSection: React.FC = () => {
  const {
    github: { viewer, user },
  } = useGitHubData()

  const pinnedItemsNodes = user?.pinnedItems?.nodes
  return (
    <>
      <h2 css={styles.title}>Coding Activities</h2>
      <div css={styles.description}>This is GitHub profile.</div>
      <div css={styles.container}>
        <div css={styles.container__info}>
          <img css={styles.profile__avatar} src={viewer.avatarUrl} />
          <div css={styles.profile__username}>{viewer.name}</div>

          <div css={styles.divider} />

          <div>
            <div css={styles.userInfo__content}>
              <FontAwesomeIcon color="#333" size="sm" css={styles.userInfo__content__icon} icon={faEnvelope} />
              {viewer.email}
            </div>
            <div css={styles.userInfo__content}>
              <FontAwesomeIcon color="#333" size="sm" css={styles.userInfo__content__icon} icon={faLink} />
              {viewer.websiteUrl}
            </div>
            <div css={styles.userInfo__content}>
              <FontAwesomeIcon color="#333" size="sm" css={styles.userInfo__content__icon} icon={faMapMarkerAlt} />
              {viewer.location}
            </div>
          </div>

          <div css={styles.divider} />

          <div css={styles.subtitle}>Organizations</div>
          <div css={styles.profile__orgs}>
            {viewer.organizations.nodes?.map(
              (n) =>
                n && (
                  <a key={n.avatarUrl} css={styles.orgs__content} href={n.url}>
                    <img src={n.avatarUrl} css={styles.orgs__content__icon} />
                  </a>
                )
            )}
          </div>

          <div css={styles.divider} />
        </div>

        <div css={styles.container__main}>
          <div css={styles.subtitle}>Repositories</div>

          <div css={styles.repos}>
            {pinnedItemsNodes?.map(
              (repo, i) =>
                repo && (
                  <a css={styles.repo} href={repo.url} key={i}>
                    <div css={styles.repo__name}>
                      <div css={styles.repo__name__inner}>
                        {repo?.owner.login}/{repo?.name}
                      </div>
                    </div>

                    <div css={styles.repo__description}>{repo?.description}</div>

                    <div css={styles.repo__info}>
                      <div css={styles.repo__info__factor}>
                        <FontAwesomeIcon color="#333" size="sm" css={styles.repo__info__icon} icon={faStar} />
                        {repo?.stargazers.totalCount}
                      </div>

                      <div css={styles.repo__info__factor}>
                        <FontAwesomeIcon color="#333" size="sm" css={styles.repo__info__icon} icon={faCodeBranch} />
                        {repo?.forkCount}
                      </div>
                    </div>
                  </a>
                )
            )}
          </div>

          <GitHubCalendar username="takumon" years={[2020, 2019]} fullYear={false} fontSize={10}>
            <ReactTooltip delayShow={30} html />
          </GitHubCalendar>
        </div>
      </div>
    </>
  )
}

export default GitHubProfileSection

const styles = {
  container: css`
    display: flex;
    width: 90%;
    margin-left: auto;
    margin-right: auto;

    @media screen and (max-width: 720px) {
      flex-direction: column;
    }
  `,

  container__info: css`
    width: 240px;
    padding-right: 12px;

    @media screen and (max-width: 720px) {
      width: 100%;
    }
  `,

  container__main: css`
    width: calc(100% - 240px);
    @media screen and (max-width: 720px) {
      width: 100%;
    }
  `,

  divider: css`
    width: 100%;
    height: 0;
    border-bottom: 0.1px solid var(--bgLightLittle);
    margin-top: 12px;
    margin-bottom: 12px;
  `,

  title: css`
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  `,

  description: css`
    width: 90%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 64px;
  `,

  profile__avatar: css`
    margin-right: 12px;
    width: 128px;
    height: 128px;
    border-radius: 50%;
    margin-bottom: 8px;
  `,

  profile__username: css`
    font-family: Rubik, sans-serif;
    font-weight: 600;
    font-size: 24px;
    line-height: 24px;
    color: var(--text);
    margin-right: 8px;
    margin-bottom: 12px;
  `,

  profile__orgs: css`
    margin-bottom: 12px;
    display: flex;
    align-items: flex-end;
  `,

  orgs__content: css`
    margin: 0;
    margin-right: 6px;
    height: 28px;
  `,

  orgs__content__icon: css`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin: 0;
    background: var(--text);
  `,

  userInfo__content: css`
    color: var(--text);
    margin-bottom: 2px;
    -webkit-box-align: center;
    align-items: center;
    display: flex;
    font-size: 0.8rem;
  `,

  userInfo__content__icon: css`
    margin-right: 8px;
  `,

  subtitle: css`
    font-family: Rubik, sans-serif;
    font-weight: 600;
    font-size: 24px;
    color: var(--text);
    margin: 0px 0px 8px;
  `,

  repos: css`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  `,

  repo: css`
    transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
    display: block;
    margin-bottom: 8px;
    width: calc(50% - 4px);
    text-align: left;
    padding: 16px;
    background-color: var(--bgLight);
    border-radius: 3px;
    border: 1px solid var(--underline);

    &:hover {
      opacity: 1;
      transform: scale(1.02);
      color: var(--textLightLittle);
    }
    @media screen and (max-width: 1000px) {
      width: 100%;
    }
  `,

  repo__name: css`
    margin-bottom: 4px;
  `,

  repo__name__inner: css`
    font-size: 16px;
    font-weight: 600;
    font-family: Rubik, sans-serif;
  `,

  repo__description: css`
    white-space: normal;
    margin-bottom: 8px;
    font-size: 0.75rem;
    color: var(--text);
  `,

  repo__info: css`
    display: flex;
  `,

  repo__info__factor: css`
    margin-right: 24px;
    font-size: 0.75rem;
    color: var(--text);
  `,

  repo__info__icon: css`
    margin-right: 4px;
  `,
}
