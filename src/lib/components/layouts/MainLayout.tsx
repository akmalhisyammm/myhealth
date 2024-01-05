'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, HStack } from '@chakra-ui/react';

import { AuthContext } from '@/lib/contexts/auth';
import { Navbar, Sidebar } from '@/lib/components/organisms';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isRegistered, isInitializing } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return router.replace('/');
    if (!isRegistered) return router.replace('/auth/register');
  }, [router, isAuthenticated, isRegistered]);

  if (isInitializing || !isAuthenticated || !isRegistered) return null;

  return (
    <Box minHeight="100vh" backgroundColor="gray.50">
      <Navbar isLoggedIn />
      <HStack>
        <Sidebar />
        <Box as="main" width="full" marginTop={85} marginLeft={[0, 0, 300]} padding={4}>
          {children}
        </Box>
      </HStack>
    </Box>
  );
};

export default MainLayout;
