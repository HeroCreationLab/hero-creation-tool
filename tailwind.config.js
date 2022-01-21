module.exports = {
  content: ['./src/**/*.{html,ts}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      flexGrow: {
        2: 2,
      },
    },
    spacing: {
      sm: '5px',
      md: '10px',
      lg: '20px',
      xl: '40px',
    },
  },
  plugins: [],
  prefix: 'hct-',
};
