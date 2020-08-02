import React from 'react'
import { ThemeToggler } from 'gatsby-plugin-dark-mode'

export const DarkToggle: React.FC = () => {
  return (
    <ThemeToggler>
      {({ theme, toggleTheme }) => {
        if (!theme) {
          return null
        }

        return (
          <label>
            <input type="checkbox" checked={theme === 'dark'} onChange={(e) => toggleTheme(e.target.checked ? 'dark' : 'light')} />
            Dark Mode
          </label>
        )
      }}
    </ThemeToggler>
  )
}
