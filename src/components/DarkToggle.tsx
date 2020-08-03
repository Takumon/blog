import React, { useState, useCallback, useEffect } from 'react'
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

const IconButton: React.FC<ToggleProps> = ({ icon, animation, toggle, moving, stopMoving }) => {
  return (
    <div css={[styles.content, moving && animation]} onClick={toggle} onAnimationEnd={stopMoving}>
      <FontAwesomeIcon icon={icon} size={'2x'} />
    </div>
  )
}

export const DarkToggle: React.FC = () => {
  const [moving, setMoving] = useState(true)
  console.log('init!!')

  const stopMoving = useCallback(() => {
    console.log('stopMoving')
    setMoving(false)
  }, [])

  const startMoving = useCallback(() => {
    console.log('startMoving')
    setMoving(true)
  }, [])

  return (
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

        return (
          <div css={styles.content} onClick={toggle} onAnimationEnd={stopMoving}>
            {isDark ? (
              <FontAwesomeIcon css={[styles.icon, moving && styles.spin]} icon={faMoon} />
            ) : (
              <FontAwesomeIcon css={[styles.icon, moving && styles.spinRevert]} icon={faSun} />
            )}
          </div>
        )
      }}
    </ThemeToggler>
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
