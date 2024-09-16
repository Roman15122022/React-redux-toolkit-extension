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
        red: {
          light: '#D32F2F',
          dark: '#9A0000',
        },
        gray: '#212830',
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
        red: {
          light: '#D32F2F',
          dark: '#D40000',
        },
        gray: '#c0c0c0',
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
        gray: '#c0c0c0',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ preferredStrategy: 'pseudoelements' }),
  ],
}
