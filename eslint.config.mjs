import js from '@eslint/js'

export default [
  js.configs.recommended,
  {
    ignores: ['node_modules/'],
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
    },
  },
]
