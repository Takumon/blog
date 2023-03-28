import React from 'react'
import { Global, css } from '@emotion/react'

const styles = css`
  .gatsby-code-title {
    background: var(--codeBG);
    color: var(--code);
    margin-bottom: -0.65em;
    padding: 0.4rem 1.05rem;
    font-size: 0.8em;
    line-height: 1.2;
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace;
    font-weight: 600;
    border-radius: 8px 8px 0 0;
    display: table;
  }

  .gatsby-highlight-code-line {
    background-color: var(--codeHighlightBG);
    display: block;
    margin-right: -1em;
    margin-left: -1em;
    padding-right: 1em;
    padding-left: 0.75em;
    border-left: 0.25em solid var(--codeLineMarker);
  }

  .gatsby-highlight {
    background: var(--highlightBG);
    border-radius: 0.3em;
    margin: 0.5em 0;
    padding: 1em;
    overflow: auto;
  }

  .gatsby-highlight pre[class*='language-'] {
    background-color: transparent;
    margin: 0;
    padding: 0;
    overflow: initial;
    float: left;
    min-width: 100%;
  }

  .gatsby-highlight pre[class*='language-'].line-numbers {
    padding-left: 2.8em;
  }
`

const HighlightStyle: React.FC = () => {
  return <Global styles={styles} />
}

export default HighlightStyle
