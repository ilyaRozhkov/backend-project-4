import eslintJs from '@eslint/js';
import airbnb from 'eslint-config-airbnb-base';
import globals from 'globals';

export default [
  eslintJs.configs.recommended,
  {
    ...airbnb,
    languageOptions: {
      ...airbnb.languageOptions,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    }
  },
  {
    rules: {
      'no-console': 'off',
      'import/extensions': [
        'error',
        'ignorePackages',
        { js: 'always' }
      ],
      'no-underscore-dangle': [
        'error', 
        { allow: ['__filename', '__dirname'] }
      ]
    }
  }
];
