import { Heading } from '@chakra-ui/react';

// import { APP_NAME, APP_URL } from '@/lib/constants/meta';
import { MainLayout } from '@/lib/components/layouts';

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
  return (
    <MainLayout>
      <Heading as="h3" size="lg" color="brand.500" marginBottom={4}>
        Rekam Medis
      </Heading>
    </MainLayout>
  );
};

export default MedicalRecords;
