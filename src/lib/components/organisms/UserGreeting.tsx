'use client';

import { AuthContext } from '@/lib/contexts/auth';
import { greetingMessage } from '@/lib/utils/greeting';
import { VStack, Heading } from '@chakra-ui/react';
import { useContext } from 'react';

const UserGreeting = () => {
  const { user } = useContext(AuthContext);

  return (
    <VStack
      width="full"
      alignItems="start"
      backgroundColor="white"
      boxShadow="md"
      padding={8}
      borderWidth={1}
      borderRadius={8}
      spacing={4}
    >
      <Heading as="h3" size="lg" color="brand.500">
        {greetingMessage(user?.name || '')}
      </Heading>
      {user?.role === 'patient' ? (
        <Heading as="h4" size="md">
          Pasien
        </Heading>
      ) : (
        <Heading as="h4" size="md">
          {user?.role === 'admin' ? 'Admin' : user?.role === 'doctor' ? 'Dokter' : 'Perawat'} -{' '}
          {user?.hospital.name}
        </Heading>
      )}
    </VStack>
  );
};

export default UserGreeting;
