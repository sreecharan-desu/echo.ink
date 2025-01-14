module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            h1: {
              fontSize: '2.5em',
              fontWeight: '700',
              marginTop: '1em',
              marginBottom: '0.5em',
            },
            h2: {
              fontSize: '2em',
              fontWeight: '700',
              marginTop: '1em',
              marginBottom: '0.5em',
            },
            strong: {
              fontWeight: '700',
            },
            code: {
              backgroundColor: '#f1f5f9',
              padding: '0.2em 0.4em',
              borderRadius: '0.25em',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#1e293b',
              color: '#e2e8f0',
              padding: '1em',
              borderRadius: '0.5em',
              marginTop: '1em',
              marginBottom: '1em',
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              borderRadius: '0',
              color: 'inherit',
            },
            blockquote: {
              borderLeftWidth: '4px',
              borderLeftColor: '#e2e8f0',
              fontStyle: 'italic',
              marginTop: '1em',
              marginBottom: '1em',
              paddingLeft: '1em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 