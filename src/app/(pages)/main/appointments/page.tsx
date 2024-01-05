import { Heading } from '@chakra-ui/react';

import { MainLayout } from '@/lib/components/layouts';

const Appointments = () => {
  return (
    <MainLayout>
      <Heading as="h3" size="lg" color="brand.500" marginBottom={4}>
        Janji Temu
      </Heading>
    </MainLayout>
  );
};

export default Appointments;
