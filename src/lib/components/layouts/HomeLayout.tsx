'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container } from '@chakra-ui/react';

import { AuthContext } from '@/lib/contexts/auth';
import { Footer, Navbar } from '@/lib/components/organisms';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isRegistered, isInitializing } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;
    return isRegistered ? router.replace('/main/dashboard') : router.replace('/auth/register');
  }, [router, isAuthenticated, isRegistered]);

  if (isInitializing || isAuthenticated) return null;

  return (
    <Box minHeight="100vh" backgroundColor="blue.50">
      <Navbar />
      <Container as="main" maxWidth="full" position="relative" top={85} padding={0}>
        {children}
        <Footer />
      </Container>
    </Box>
  );
};

export default HomeLayout;
