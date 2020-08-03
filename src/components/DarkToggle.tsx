import React, { useState, useCallback } from 'react'
import { css, keyframes } from '@emotion/core'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

type ToggleProps = {
  icon: any
  animation: any
  toggle: () => void
  moving: boolean
  stopMoving: () => void
}

export const DarkToggle: React.FC = () => {
  const [moving, setMoving] = useState(false)

  const stopMoving = useCallback(() => {
    setMoving(false)
  }, [])

  const startMoving = useCallback(() => {
    setMoving(true)
  }, [])

  return (
    <div css={styles.content}>
      <ThemeToggler>
        {({ theme, toggleTheme }) => {
          if (!theme) {
            return null
          }

          const isDark = theme === 'dark'
          const toggle = () => {
            toggleTheme(isDark ? 'light' : 'dark')
            startMoving()
          }

          const icon = isDark ? (
            <FontAwesomeIcon css={[styles.icon, moving && styles.spin]} icon={faMoon} />
          ) : (
            <FontAwesomeIcon css={[styles.icon, moving && styles.spinRevert]} icon={faSun} />
          )

          return (
            <div onClick={toggle} onAnimationEnd={stopMoving}>
              {icon}
            </div>
          )
        }}
      </ThemeToggler>
    </div>
  )
}

const spin = keyframes`
  0%  {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}   
`

const spinRevert = keyframes`
  0%  {transform: rotate(0deg);}
  100% {transform: rotate(-360deg);}   
`

const styles = {
  content: css`
    position: absolute;
    top: 0;
    right: 0;
    margin: 32px;

    @media screen and (max-width: 580px) {
      margin: 24px;
    }
  `,
  icon: css`
    cursor: pointer;
    color: var(--textLight);
    font-size: 32px;

    &:hover {
      opacity: 0.8;
    }

    @media screen and (max-width: 580px) {
      font-size: 24px;
    }
  `,
  spin: css`
    animation: ${spin} 1s 1 var(--transitionMode);
  `,
  spinRevert: css`
    animation: ${spinRevert} 1s 1 var(--transitionMode);
  `,
}
