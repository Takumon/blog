import Typography from 'typography'
import Wordpress2016 from 'typography-theme-wordpress-2016'

Wordpress2016.overrideThemeStyles = () => ({
  'html,body,h1,h2,h3,h4,h5,h6': {
    color: '#444',
    fontFamily: [
      '"游ゴシック体"',
      'YuGothic',
      'YuGothic M',
      'Merriweather',
      'Georgia',
    ].join(','),
    '-webkit-font-smoothing': 'antialiased',
    fontKerning: 'auto',
    fontVariantLigatures: 'none',
    letterSpacing: '.05rem',
    lineHeight: '1.75',
  },
  'h1 a,h2 a,h3 a,h4 a,h5 a,h6 a': {
    color: '#444'
  },
  'html, body': {
    fontWeight: '500'
  },
  'a:hover': {
    opacity: '0.7'
  },
  'a.gatsby-resp-image-link': {
    boxShadow: 'none',
  },


  'ul li': {
    marginLeft: '1.5rem'
  },
  'li > ul': {
    marginLeft: '0rem'
  },
  'ol li': {
    marginLeft: '1.5rem'
  },
  'li > ol': {
    marginLeft: '0rem'
  },

  '.blogTitleArea': {
    fontSize: '4em',
    marginBottom: '0.5em',
    marginTop: '0',
    fontFamily: 'Montserrat',
    lineHeight: '1.5',
  },
  '.blogTitle': {
    'boxShadow': 'none',
    'color': '#444',
  },
})


delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

const { rhythm, scale } = typography;
export { rhythm, scale, typography as default };
