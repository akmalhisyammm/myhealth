'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Heading, useToast } from '@chakra-ui/react';

import { HomeLayout } from '@/lib/components/layouts';
import { AuthContext } from '@/lib/contexts/auth';

const Home = () => {
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const { isAuthenticated, isRegistered, isLoading, signIn } = useContext(AuthContext);

  const router = useRouter();
  const toast = useToast();

  const onSignIn = async () => {
    try {
      setIsLoggingIn(true);
      await signIn();
    } catch (err) {
      toast({
        title: 'Gagal masuk!',
        description: 'Terjadi kesalahan, silakan coba lagi.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isLoggingIn) return;
    if (isRegistered) {
      toast({
        title: 'Berhasil masuk!',
        description: 'Anda akan diarahkan ke halaman utama.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    setTimeout(
      () => (isRegistered ? router.push('/main/dashboard') : router.push('/auth/register')),
      1000
    );
  }, [router, toast, isAuthenticated, isRegistered, isLoggingIn]);

  return (
    <HomeLayout isLoggingIn={isLoggingIn}>
      <Heading as="h2" size="xl">
        Welcome to MyHealth!
      </Heading>
      <Button
        colorScheme="blue"
        loadingText="Masuk"
        marginY={2}
        isLoading={isLoading}
        onClick={onSignIn}
      >
        Masuk
      </Button>
    </HomeLayout>
  );
};

export default Home;
