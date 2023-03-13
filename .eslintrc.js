module.exports = {
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['@typescript-eslint', 'react', 'emotion'],
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
      extends: [
        'plugin:react-hooks/recommended',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
        'react/prop-types': 'off',
        'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
        // FIXME: 以下の無効化は全て削除したい
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/unbound-method': 'off',
      },
    },
  ],
}
