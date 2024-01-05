'use client';

import { useContext } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

import { MainLayout } from '@/lib/components/layouts';
import { AuthContext } from '@/lib/contexts/auth';
import { greetingMessage } from '@/lib/utils/greeting';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <MainLayout>
      <Heading as="h3" size="lg" color="brand.500" marginBottom={4}>
        Dashboard
      </Heading>
      <Box>
        <Text>{greetingMessage(user?.name || '')}</Text>
        <Text>You are a {user?.role}.</Text>
        <Text>You are {user?.isVerified ? 'verified' : 'not verified'}.</Text>
      </Box>
    </MainLayout>
  );
};

export default Dashboard;
