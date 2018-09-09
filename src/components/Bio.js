import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src="https://s.gravatar.com/avatar/37d27f624f8c9c8db6fe6b6581b256f1?s=80"
          alt={`Kyle Mathews`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: rhythm(1),
          }}
        />
        <p>
          Written by <strong>Takuto Inoue</strong> who lives and works in Tokyo building useful things.{' '}
        </p>
      </div>
    )
  }
}

export default Bio
