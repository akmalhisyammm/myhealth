'use client';

import { useContext } from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription, VStack } from '@chakra-ui/react';

import { AuthContext } from '@/lib/contexts/auth';
import { MainLayout } from '@/lib/components/layouts';
import { UserGreeting, UserIdentity } from '@/lib/components/organisms';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <MainLayout>
      {user?.isVerified ? (
        <VStack spacing={4}>
          <UserGreeting />
          <UserIdentity />
        </VStack>
      ) : (
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height={200}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Anda belum terverifikasi!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Verifikasi akun Anda terlebih dahulu untuk dapat mengakses fitur pada halaman ini.
          </AlertDescription>
        </Alert>
      )}
    </MainLayout>
  );
};

export default DashboardPage;
