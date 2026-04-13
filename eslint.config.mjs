export default [
  {
    ignores: ['node_modules', 'dist', 'build'],
  },
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
];
