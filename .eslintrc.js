module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['@typescript-eslint', 'react'],
  globals: {
    graphql: false,
  },
  rules: {
    'react/prop-types': 'off',
    'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
        ecmaFeatures: {
          experimentalObjectRestSpread: true,
          jsx: true,
        },
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
        'react/prop-types': 'off',
        'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      },
      extends: [
        'plugin:react-hooks/recommended',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
        // 'prettier/@typescript-eslint',
        // 'plugin:prettier/recommended',
      ],
    },
  ],
}
