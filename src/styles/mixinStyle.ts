import { css, keyframes } from '@emotion/core'

export const gradientBackground = css`
  background: -moz-linear-gradient(65deg, #f13f79, #ffc778);
  background: -webkit-linear-gradient(65deg, #f13f79, #ffc778);
  background: linear-gradient(25deg, #f13f79, #ffc778);
`

export const maxContentWidth = css`
  margin-left: auto;
  margin-right: auto;
  max-width: 710px;
  width: 100%;
`

export const fullWidth = css`
  width: 100vw;
  overflow: hidden;
`

export const flexColumnCenter = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`

export const fadeInDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-10px);
    -webkit-transform: translateY(-10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    -webkit-transform: translateY(0);
  }
`

export const colorFontSection = '#444'
