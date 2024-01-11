'use client';

import { useContext } from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, VStack } from '@chakra-ui/react';

import { AuthContext } from '@/lib/contexts/auth';
import { MainLayout } from '@/lib/components/layouts';
import {
  DoctorAppointments,
  DoctorSchedules,
  PatientAppointments,
} from '@/lib/components/organisms';

const AppointmentsPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <MainLayout>
      {user?.role === 'doctor' && !user?.isVerified && (
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
      {user?.role === 'doctor' && user?.isVerified && (
        <VStack spacing={4}>
          <DoctorSchedules />
          <DoctorAppointments />
        </VStack>
      )}
      {user?.role === 'patient' && <PatientAppointments />}
    </MainLayout>
  );
};

export default AppointmentsPage;
