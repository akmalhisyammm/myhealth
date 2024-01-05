import { extendTheme } from '@chakra-ui/react';
import { Nunito } from 'next/font/google';

const fontHeading = Nunito({
  subsets: ['latin'],
  variable: '--font-heading',
});

const fontBody = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f0f5',
      100: '#b0d2df',
      200: '#8abccf',
      300: '#549db9',
      400: '#338aac',
      500: '#006d97',
      600: '#006389',
      700: '#004d6b',
      800: '#003c53',
      900: '#002e3f',
    },
  },
  fonts: {
    heading: fontHeading.style.fontFamily,
    body: fontBody.style.fontFamily,
  },
});
