import { createTheme, MantineColorsTuple } from '@mantine/core';

// Custom green color palette matching your garden theme
const green: MantineColorsTuple = [
  '#dcfce7', // 0 - lightest
  '#bbf7d0', // 1
  '#86efac', // 2 - lighter
  '#4ade80', // 3 - light
  '#22c55e', // 4 - main
  '#16a34a', // 5 - dark
  '#15803d', // 6 - darker
  '#166534', // 7
  '#14532d', // 8 - darkest
  '#052e16', // 9
];

export const theme = createTheme({
  colors: {
    green,
  },
  primaryColor: 'green',
  defaultRadius: 'md',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  headings: {
    fontWeight: '600',
  },
});
