import { CreateWebpackConfigArgs } from 'gatsby'

// ref
// https://github.com/plotly/react-cytoscapejs/issues/28
// https://www.gatsbyjs.org/docs/debugging-html-builds/#fixing-third-party-modules
export const onCreateWebpackConfig = ({ stage, loaders, actions }: CreateWebpackConfigArgs) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-cytoscapejs/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}
