'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container } from '@chakra-ui/react';

import { AuthContext } from '@/lib/contexts/auth';
import { Navbar } from '@/lib/components/organisms';

type HomeLayout = {
  children: React.ReactNode;
  isLoggingIn?: boolean;
};

const HomeLayout = ({ children, isLoggingIn }: HomeLayout) => {
  const { isAuthenticated, isRegistered, isInitializing } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!isLoggingIn) {
      return isRegistered ? router.replace('/main/dashboard') : router.replace('/auth/register');
    }
  }, [router, isAuthenticated, isRegistered, isLoggingIn]);

  if ((isInitializing || isAuthenticated) && !isLoggingIn) return null;

  return (
    <Box minHeight="100vh" backgroundColor="gray.100">
      <Navbar />
      <Container as="main" maxWidth="container.lg" position="relative" top={85} padding={4}>
        {children}
      </Container>
    </Box>
  );
};

export default HomeLayout;
