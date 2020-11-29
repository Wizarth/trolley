module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    'plugin:react/recommended',
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    '@typescript-eslint',
  ],
  'rules': {
    // Default of 80? C'mon...
    'max-len': ['warn', {
      'code': 120,
    }],
    // Off because typescript covers types, and descriptions always end up blank
    'require-jsdoc': 'off',
    // Off because it doesn't know about passing the props type via the FunctionComponent template
    'react/prop-types': 'off',
  },
  'settings': {
    'react': {
      'version': 'detect',
    },
  },
};
