import Typography from 'typography'
import Wordpress2016 from 'typography-theme-wordpress-2016'

Wordpress2016.overrideThemeStyles = () => ({
  '@font-face': {
    fontFamily: '"Yu Gothic"',
    src: 'local("Yu Gothic Medium")',
    fontWeight: 100,
  },
  '@font-face': {
    fontFamily: '"Yu Gothic"',
    src: 'local("Yu Gothic Medium")',
    fontWeight: 200,
  },
  '@font-face': {
    fontFamily: '"Yu Gothic"',
    src: 'local("Yu Gothic Medium")',
    fontWeight: 300,
  },
  '@font-face': {
    fontFamily: '"Yu Gothic"',
    src: 'local("Yu Gothic Medium")',
    fontWeight: 400,
  },
  '@font-face': {
    fontFamily: '"Yu Gothic"',
    src: 'local("Yu Gothic Bold")',
    fontWeight: 'bold',
  },
  '@font-face': {
    fontFamily: '"Helvetica Neue"',
    src: 'local("Helvetica Neue Regular")',
    fontWeight: 100,
  },
  '@font-face': {
    fontFamily: '"Helvetica Neue"',
    src: 'local("Helvetica Neue Regular")',
    fontWeight: 200,
  },

  'html,body,h1,h2,h3,h4,h5,h6': {
    color: 'var(--title)',
    fontFamily: [
      '-apple-system-body',
      'BlinkMacSystemFont',
      'Helvetica Neue',
      'Helvetica Sans',
      'Hiragino Kaku Gothic ProN',
      '"Noto Sans Japanese"',
      '"游ゴシック  Medium"',
      '"Yu Gothic Medium"',
      '"メイリオ"',
      'meiryo',
      'sans-serif',
    ].join(','),
    '-webkit-font-smoothing': 'antialiased',
    fontKerning: 'auto',
    fontVariantLigatures: 'none',
    letterSpacing: '.05rem',
    lineHeight: '1.8',
  },
  '@media all and (-ms-high-contrast: none)': {
    html: {
      fontFamily: 'Verdana, Meiryo, sans-serif',
    },
  },
  '@media all and (-ms-high-contrast: active)': {
    html: {
      fontFamily: 'Verdana, Meiryo, sans-serif',
    },
  },
  'h1,h2,h3,h4,h5,h6': {
    textTransform: 'none',
  },
  'h1 a,h2 a,h3 a,h4 a,h5 a,h6 a': {
    color: 'var(--title)',
  },
  h2: {
    fontSize: '1.6rem',
    borderBottom: '1px solid var(--titleBorder)',
  },
  a: {
    boxShadow: 'none',
    color: 'var(--textLink)',
  },
  'a:hover': {
    opacity: '0.7',
    boxShadow: '0 1px 0 0 currentColor',
  },
  'a.gatsby-resp-image-link': {
    boxShadow: 'none',
  },
})

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

const { rhythm, scale } = typography
export { rhythm, scale, typography as default }
