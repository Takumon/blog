module.exports = {
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    node: true,
  },
  plugins: ['react', '@emotion', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
    'no-anonymous-exports-page-templates': 'warn',
    'limited-exports-page-templates': 'warn',
    'react/no-unknown-property': ['error', { ignore: ['css'] }],
  },
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
}
