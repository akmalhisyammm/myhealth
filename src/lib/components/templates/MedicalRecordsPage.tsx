'use client';

import { useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertIcon, AlertDescription, AlertTitle } from '@chakra-ui/react';

import { AuthContext } from '@/lib/contexts/auth';
import { MainLayout } from '@/lib/components/layouts';
import {
  DoctorMedicalRecords,
  NurseMedicalRecords,
  PatientMedicalRecords,
} from '@/lib/components/organisms';

const MedicalRecordsPage = () => {
  const { user } = useContext(AuthContext);

  const searchParams = useSearchParams();

  return (
    <MainLayout>
      {!user?.isVerified && (
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
      {user?.role === 'doctor' && user?.isVerified && !searchParams.get('patientId') && (
        <DoctorMedicalRecords />
      )}
      {user?.role === 'nurse' && user?.isVerified && <NurseMedicalRecords />}
      {((user?.role === 'patient' && user?.isVerified) ||
        (user?.role === 'doctor' && user?.isVerified && searchParams.get('patientId'))) && (
        <PatientMedicalRecords id={searchParams.get('patientId') || undefined} />
      )}
    </MainLayout>
  );
};

export default MedicalRecordsPage;
