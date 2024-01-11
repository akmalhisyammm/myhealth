'use client';

import { Box, Heading, Text } from '@chakra-ui/react';

import { AuthLayout } from '@/lib/components/layouts';
import { RegisterForm } from '@/lib/components/organisms';

const RegisterPage = () => {
  return (
    <AuthLayout>
      <Box>
        <Heading as="h3" size="lg" marginBottom={2}>
          Registrasi
        </Heading>
        <Text marginBottom={4}>Silakan isi data diri anda dengan benar.</Text>
      </Box>
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
