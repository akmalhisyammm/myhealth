'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';

import { AuthProvider } from '@/lib/contexts/auth';
import { theme } from '@/lib/styles/theme';

import 'dayjs/locale/id';
import 'gridjs/dist/theme/mermaid.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@/lib/styles/globals.css';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <AuthProvider>{children}</AuthProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
