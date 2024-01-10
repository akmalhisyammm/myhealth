'use client';

import { useContext } from 'react';
import { Alert, AlertIcon, AlertDescription, AlertTitle } from '@chakra-ui/react';

// import { APP_NAME, APP_URL } from '@/lib/constants/meta';
import { AuthContext } from '@/lib/contexts/auth';
import { MainLayout } from '@/lib/components/layouts';
import {
  DoctorMedicalRecords,
  NurseMedicalRecords,
  PatientMedicalRecords,
} from '@/lib/components/organisms';

// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Rekam Medis',
//   alternates: {
//     canonical: '/main/medical-records',
//   },
//   openGraph: {
//     title: `Rekam Medis | ${APP_NAME}`,
//     url: `${APP_URL}/main/medical-records`,
//   },
// };

const MedicalRecords = () => {
  const { user } = useContext(AuthContext);

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
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Anda belum terverifikasi!
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Verifikasi akun Anda terlebih dahulu untuk dapat mengakses halaman ini.
          </AlertDescription>
        </Alert>
      )}
      {user?.role === 'doctor' && user?.isVerified && <DoctorMedicalRecords />}
      {user?.role === 'nurse' && user?.isVerified && <NurseMedicalRecords />}
      {user?.role === 'patient' && user?.isVerified && <PatientMedicalRecords />}
    </MainLayout>
  );
};

export default MedicalRecords;
