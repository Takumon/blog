import React from 'react'
import { Global, css } from '@emotion/react'
import emotionNormalize from 'emotion-normalize'

const NormalizeStyle: React.FC = () => {
  return <Global styles={styles} />
}

const styles = css`
  ${emotionNormalize}
`

export default NormalizeStyle
