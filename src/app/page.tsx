'use client';

import { useContext, useState } from 'react';
import { Box, Button, Container, HStack, Heading, Skeleton, Text } from '@chakra-ui/react';

import { AuthContext } from '@/lib/contexts/auth';

const Home = () => {
  const [message, setMessage] = useState<string>('');

  const { actor, isAuthenticated, isLoading, signIn, signOut } = useContext(AuthContext);

  const onSayHello = async () => {
    if (!isAuthenticated) return;

    try {
      const hello = await actor?.sayHello();
      setMessage(hello || '');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container as="main" maxWidth="container.lg" padding={4} centerContent>
      <Heading as="h1" size="2xl" marginBottom={4}>
        Welcome to MyHealth!
      </Heading>
      <Skeleton isLoaded={!isLoading}>
        {isAuthenticated ? (
          <Box textAlign="center">
            <HStack marginY={2}>
              <Button colorScheme="blue" onClick={onSayHello}>
                Say Hello
              </Button>
              <Button colorScheme="red" onClick={signOut}>
                Sign Out
              </Button>
            </HStack>
            {message && <Text>{message}</Text>}
          </Box>
        ) : (
          <Button colorScheme="green" marginY={2} onClick={signIn}>
            Sign In
          </Button>
        )}
      </Skeleton>
    </Container>
  );
};

export default Home;
