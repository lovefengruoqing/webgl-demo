module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    "react/jsx-filename-extension": [0, { "extensions": [".js", ".jsx"] }],
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "no-shadow": 0,
    "no-plusplus": 0,
    "no-bitwise": 0,
    "eqeqeq": 0,
    "no-param-reassign": 0,
    "react/prop-types": 0,
    "no-throw-literal": 0,
    "no-console": 0,
    "import/prefer-default-export": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "no-underscore-dangle": 0,
    "max-classes-per-file": 0
  },
};
