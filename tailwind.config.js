module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        text: {
          light: '#000000',
          dark: '#FFFFFF',
        },
        bg: {
          light: '#FFFFFF',
          dark: '#000000',
        },
        purple: {
          light: '#ab2bc0',
          dark: '#631870',
        },
        secondary: {
          light: '#ff6347',
          dark: '#b9006a',
        },
        gray: '#c0c0c0'
      },
      borderColor: {
        purple: {
          light: '#ab2bc0',
          dark: '#631870',
        },
        secondary: {
          light: '#ff6347',
          dark: '#b9006a',
        },
        gray: '#c0c0c0'
      },
      backgroundColor: {
        purple: {
          light: '#9C27B0',
          dark: '#4E1358',
        },
        secondary: {
          light: '#ff6347',
          dark: '#b9006a',
        },
        gray: '#c0c0c0'
      },
    },
  },
  plugins: [],
}
