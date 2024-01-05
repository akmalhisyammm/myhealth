import { Heading } from '@chakra-ui/react';

import { MainLayout } from '@/lib/components/layouts';

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
