import React from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { css } from '@emotion/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithubSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import config from '../config/blog-config'
import useSpecificImages from '../hooks/useSpecificImages'

/* highlight-range{1-3} */
const Bio: React.FC = () => {
  const { avatarImage } = useSpecificImages()

  return (
    <div css={styles.content}>
      {avatarImage && <GatsbyImage image={avatarImage} alt={config.blogAuthor} css={styles.avatar} />}
      <div css={styles.main}>
        <div css={styles.description}>{config.blogDescription}</div>
        <div css={styles.profile}>
          <a aria-label="profile_link_github" css={styles.profile__link} href={config.blogAuthorGitHubUrl}>
            <FontAwesomeIcon color="#333" size="sm" css={styles.profile__icon} icon={faGithubSquare} />
          </a>
          <a aria-label="profile_link_twitter" css={styles.profile__link} href={config.blogAuthorTwitterUrl}>
            <FontAwesomeIcon color="#3eaded" size="sm" css={styles.profile__icon} icon={faTwitterSquare} />
          </a>
          <a aria-label="profile_link_qiita" css={styles.profile__link} href={config.blogAuthorQiitaUrl}>
            <FontAwesomeIcon color="white" size="sm" css={styles.profile__icon_qiita} icon={faSearch} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Bio

const styles = {
  content: css`
    display: flex;
    margin-bottom: 2em;
  `,

  avatar: css`
    margin-right: 12px;
    margin-bottom: 0;
    width: 54px;
    height: 54px;
    border-radius: 50%;
  `,

  main: css`
    display: flex;
    flex-direction: column;
  `,

  profile: css`
    display: flex;
    font-size: 1.6em;
  `,

  profile__link: css`
    padding: 0;
    margin-right: 18px;
    border: 0;
    display: block;
    box-shadow: none;
  `,

  profile__icon: css`
    display: block;
  `,

  profile__icon_qiita: css`
    display: block;
    overflow: hidden;
    height: 0.9em;
    width: 0.9em !important; // SVNのstyle属性を上書きするため
    background-color: #4cb10d;
    border-radius: 2px;
    margin-top: 2px;
  `,

  description: css`
    @media screen and (max-width: 400px) {
      font-size: 0.7em;
    }
  `,
}
