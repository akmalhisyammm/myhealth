'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@chakra-ui/react';

import { AuthContext } from '@/lib/contexts/auth';

type MainLayoutProps = {
  children: React.ReactNode;
  isLoggingOut?: boolean;
};

const MainLayout = ({ children, isLoggingOut }: MainLayoutProps) => {
  const { isAuthenticated, isRegistered, isInitializing } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (isLoggingOut) return;
    if (!isAuthenticated) return router.replace('/');
    if (!isRegistered) return router.replace('/auth/register');
  }, [router, isAuthenticated, isRegistered, isLoggingOut]);

  if (isInitializing || !isAuthenticated || !isRegistered) return null;

  return (
    <Container as="main" maxWidth="container.xl" padding={4} centerContent>
      {children}
    </Container>
  );
};

export default MainLayout;
