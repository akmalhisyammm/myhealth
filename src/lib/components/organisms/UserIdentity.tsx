'use client';

import { AuthContext } from '@/lib/contexts/auth';
import { nat64ToDate } from '@/lib/utils/date';
import { Box, HStack, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { use, useContext } from 'react';

const UserIdentity = () => {
  const { user } = useContext(AuthContext);

  return (
    <VStack
      width="full"
      alignItems="start"
      backgroundColor="white"
      boxShadow="md"
      padding={8}
      borderWidth={1}
      borderRadius={8}
      spacing={4}
    >
      <Heading as="h3" size="lg" color="brand.500">
        Identitas Pengguna
      </Heading>
      <SimpleGrid columns={[1, 1, 2]} spacing={[4, 4, 8]}>
        <VStack width="full" alignItems="start" spacing={4}>
          <Text>
            <strong>ID:</strong> {user?.id.toText()}
          </Text>
          {user?.role !== 'patient' ? (
            <Text>
              <strong>NIP:</strong> {user?.nip}
            </Text>
          ) : (
            <Text>
              <strong>NIK:</strong> {user?.nik}
            </Text>
          )}
          <Text>
            <strong>Nama:</strong> {user?.name}
          </Text>
          <Text>
            <strong>Jenis Kelamin:</strong> {user?.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
          </Text>
          {user?.role === 'doctor' && (
            <Text>
              <strong>Spesialisasi:</strong> {user?.specialization}
            </Text>
          )}
          <Text>
            <strong>Umur:</strong> {user?.age}
          </Text>
          <Text>
            <strong>Tempat & Tanggal Lahir:</strong> {user?.birthPlace},{' '}
            {user?.birthDate
              ? dayjs(nat64ToDate(user?.birthDate)).locale('id').format('DD MMMM YYYY')
              : ''}
          </Text>
          <Text>
            <strong>Golongan Darah:</strong> {user?.bloodType}
            {user?.bloodRhesus}
          </Text>
          <Text>
            <strong>Agama:</strong> {user?.religion}
          </Text>
        </VStack>
        <VStack width="full" alignItems="start" spacing={4}>
          <Text>
            <strong>Alamat:</strong> {user?.address}
          </Text>
          <Text>
            <strong>Kelurahan:</strong> {user?.subDistrict}
          </Text>
          <Text>
            <strong>Kecamatan:</strong> {user?.district}
          </Text>
          <Text>
            <strong>Kota/Kabupaten:</strong> {user?.city}
          </Text>
          <Text>
            <strong>Provinsi:</strong> {user?.province}
          </Text>
          <Text>
            <strong>Kode Pos:</strong> {user?.postalCode}
          </Text>
          <Text>
            <strong>Negara:</strong> {user?.country}
          </Text>
          <Text>
            <strong>Email:</strong> {user?.email}
          </Text>
          <Text>
            <strong>Telepon:</strong> {user?.phone}
          </Text>
        </VStack>
      </SimpleGrid>
    </VStack>
  );
};

export default UserIdentity;
