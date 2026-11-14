import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

const jsxParserOptions = { ecmaFeatures: { jsx: true } }

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['server/**/*.{js,jsx}', 'scripts/**/*.{js,jsx}', '*.config.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
      parserOptions: jsxParserOptions,
    },
  },
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: {
      globals: globals.browser,
      parserOptions: jsxParserOptions,
    },
  },
  {
    files: [
      'src/components/**/*.jsx',
      'src/pages/**/*.jsx',
      'src/App.jsx',
      'src/main.jsx',
    ],
    extends: [reactRefresh.configs.vite],
    languageOptions: {
      globals: globals.browser,
      parserOptions: jsxParserOptions,
    },
  },
])
