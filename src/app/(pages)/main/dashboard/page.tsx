'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Heading, Text, useToast } from '@chakra-ui/react';

import { MainLayout } from '@/lib/components/layouts';
import { AuthContext } from '@/lib/contexts/auth';

const Dashboard = () => {
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const { user, isAuthenticated, isRegistered, isInitializing, isLoading, signOut } =
    useContext(AuthContext);

  const router = useRouter();
  const toast = useToast();

  const onSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast({
        title: 'Berhasil keluar!',
        description: 'Anda akan diarahkan ke halaman beranda.',
        status: 'success',
        duration: 3000,
      });
      setTimeout(() => router.push('/'), 1000);
    } catch (err) {
      toast({
        title: 'Gagal keluar!',
        description: 'Terjadi kesalahan, silakan coba lagi.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (isLoggingOut) return;
    if (!isAuthenticated) return router.replace('/');
    if (!isRegistered) return router.replace('/auth/register');
  }, [router, isAuthenticated, isRegistered, isLoggingOut]);

  if (isInitializing || !isAuthenticated || !isRegistered) return null;

  console.log(user);

  return (
    <MainLayout isLoggingOut={isLoggingOut}>
      <Heading as="h1" size="2xl" marginBottom={4}>
        Dashboard
      </Heading>

      {user && (
        <Box textAlign="center">
          <Text>
            Hello, {user.name}! You are a {user.role}!
          </Text>
          <Text>You are {user.isVerified ? 'verified' : 'not verified'}.</Text>
          <Button
            colorScheme="red"
            loadingText="Keluar"
            marginY={2}
            isLoading={isLoading}
            onClick={onSignOut}
          >
            Keluar
          </Button>
        </Box>
      )}
    </MainLayout>
  );
};

export default Dashboard;
