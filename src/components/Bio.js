import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithubSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import {
  blogDescription,
  blogAuthorAvatarUrl,
  blogAuthorGitHubUrl,
  blogAuthorTwitterUrl,
  blogAuthorQiitaUrl,
} from '../config/blog-config.js';
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2),
        }}
      >
        <img
          src={blogAuthorAvatarUrl}
          alt={`Takuto Inoue`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: rhythm(1),
          }}
        />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div>{blogDescription}</div>
          <div className="profile" style={{display: 'flex',fontSize: '1.6em'}}>
            <a
              className="profile__link"
              href={blogAuthorGitHubUrl}>
              <FontAwesomeIcon
                color="#333"
                className="profile__icon"
                icon={faGithubSquare} />
            </a>
            <a
              className="profile__link"
              href={blogAuthorTwitterUrl}>
              <FontAwesomeIcon
                color="#3eaded"
                className="profile__icon"
                icon={faTwitterSquare} />
            </a>
            <a
              className="profile__link"
              href={blogAuthorQiitaUrl}>
              <FontAwesomeIcon
                color="white"
                className="profile__icon"
                style={{
                  overflow: 'hidden',
                  height: '0.9em',
                  width: '0.9em',
                  backgroundColor: '#4cb10d',
                  borderRadius: '2px',
                  marginTop: '2px',
                }}
                icon={faSearch} />
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default Bio
