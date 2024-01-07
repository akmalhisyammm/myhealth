'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Box, Button, VStack } from '@chakra-ui/react';
import { FaCalendarAlt, FaNotesMedical } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box
      as="aside"
      height="full"
      position="fixed"
      backgroundColor="white"
      display={['none', 'none', 'block']}
      width={300}
      paddingX={2}
      paddingY={2}
      borderRightWidth={2}
      zIndex={4}
      top={85}
      left={0}
    >
      <VStack alignItems="stretch">
        <Button
          variant={pathname === '/main/dashboard' ? 'solid' : 'ghost'}
          colorScheme="brand"
          size="lg"
          justifyContent="start"
          leftIcon={<MdDashboard />}
          onClick={() => router.push('/main/dashboard')}
        >
          Dashboard
        </Button>
        <Button
          variant={pathname === '/main/appointments' ? 'solid' : 'ghost'}
          colorScheme="brand"
          size="lg"
          justifyContent="start"
          leftIcon={<FaCalendarAlt />}
          onClick={() => router.push('/main/appointments')}
        >
          Janji Temu
        </Button>
        <Button
          variant={pathname === '/main/medical-records' ? 'solid' : 'ghost'}
          colorScheme="brand"
          size="lg"
          justifyContent="start"
          leftIcon={<FaNotesMedical />}
          onClick={() => router.push('/main/medical-records')}
        >
          Rekam Medis
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;
