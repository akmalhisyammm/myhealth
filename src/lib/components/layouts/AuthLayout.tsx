'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container } from '@chakra-ui/react';

import { AuthContext } from '@/lib/contexts/auth';

type AuthLayoutProps = {
  children: React.ReactNode;
  isRegistering?: boolean;
};

const AuthLayout = ({ children, isRegistering }: AuthLayoutProps) => {
  const { isAuthenticated, isRegistered, isInitializing } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (isRegistering) return;
    if (!isAuthenticated) return router.replace('/');
    if (isRegistered) return router.replace('/main/dashboard');
  }, [router, isAuthenticated, isRegistered, isRegistering]);

  if ((isInitializing || !isAuthenticated || isRegistered) && !isRegistering) return null;

  return (
    <Box minHeight="100vh" backgroundColor="gray.100">
      <Container as="main" maxWidth="container.lg" paddingX={4} paddingY={8}>
        {children}
      </Container>
    </Box>
  );
};

export default AuthLayout;
