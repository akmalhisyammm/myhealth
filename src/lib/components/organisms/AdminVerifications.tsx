'use client';

import { useContext, useEffect, useState } from 'react';
import { FaCheck, FaInfo, FaTimes } from 'react-icons/fa';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Principal } from '@dfinity/principal';
import dayjs from 'dayjs';

import { AuthContext } from '@/lib/contexts/auth';
import { ConfirmationAlert } from '@/lib/components/molecules';
import { nat64ToDate } from '@/lib/utils/date';

import type { Result } from 'azle';
import type { Error, User } from '@/contract';

const AdminVerifications = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userDetail, setUserDetail] = useState<User | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  const { actor, user } = useContext(AuthContext);

  const detailModal = useDisclosure();
  const verifyDialog = useDisclosure();
  const rejectDialog = useDisclosure();
  const toast = useToast();

  const onReviewUser = async (isVerified: boolean) => {
    if (!actor || !userDetail) return;

    isVerified ? setIsVerifying(true) : setIsRejecting(true);

    const result: Result<any, Error> = await actor.reviewUser(
      Principal.fromText(userDetail.id.toText()),
      isVerified
    );

    if (result.Ok) {
      const updatedUsers: Result<any, Error> = await actor.getUnverifiedUsers();
      setUsers(updatedUsers.Ok || users);
      toast({
        title: isVerified ? 'Berhasil memverifikasi pengguna!' : 'Berhasil menolak pengguna!',
        description: isVerified ? 'Pengguna telah diverifikasi.' : 'Pengguna telah ditolak.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else if (result.Err) {
      toast({
        title: isVerified ? 'Gagal memverifikasi pengguna!' : 'Gagal menolak pengguna!',
        description: Object.values(result.Err)[0],
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setUserDetail(null);
    setIsVerifying(false);
    setIsRejecting(false);
    verifyDialog.onClose();
    rejectDialog.onClose();
  };

  useEffect(() => {
    if (!actor) return;
    actor.getUnverifiedUsers().then((res: Result<any, Error>) => setUsers(res.Ok || []));
  }, [actor]);

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
        Verifikasi Pengguna
      </Heading>
      <Accordion width="full" defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton
              _expanded={{
                backgroundColor: 'brand.500',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              <Box as="span" flex="1" textAlign="left">
                Dokter ({users.filter((user) => user.role === 'doctor').length})
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel paddingBottom={4}>
            <TableContainer>
              <Table variant="simple">
                <Thead backgroundColor="brand.50">
                  <Tr>
                    <Th>NIP</Th>
                    <Th>Nama Lengkap</Th>
                    <Th>Domisili</Th>
                    <Th width={200}>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {!!users.filter((u) => u.role === 'doctor' && u.hospital.id === user?.hospital.id)
                    .length ? (
                    users
                      .filter((u) => u.role === 'doctor' && u.hospital.id === user?.hospital.id)
                      .map((user) => (
                        <Tr key={user.id.toText()}>
                          <Td>{user.nip}</Td>
                          <Td>{user.name}</Td>
                          <Td>
                            {user.city}, {user.province}
                          </Td>
                          <Td display="flex" gap={2}>
                            <IconButton
                              aria-label="Verifikasi"
                              colorScheme="green"
                              icon={<FaCheck />}
                              onClick={() => {
                                setUserDetail(user);
                                verifyDialog.onOpen();
                              }}
                            />
                            <IconButton
                              aria-label="Tolak"
                              colorScheme="red"
                              icon={<FaTimes />}
                              onClick={() => {
                                setUserDetail(user);
                                rejectDialog.onOpen();
                              }}
                            />
                            <IconButton
                              aria-label="Detail"
                              colorScheme="brand"
                              icon={<FaInfo />}
                              onClick={() => {
                                setUserDetail(user);
                                detailModal.onOpen();
                              }}
                            />
                          </Td>
                        </Tr>
                      ))
                  ) : (
                    <Tr>
                      <Td textAlign="center" colSpan={4}>
                        Tidak ada akun dokter yang perlu diverifikasi.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton
              _expanded={{
                backgroundColor: 'brand.500',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              <Box as="span" flex="1" textAlign="left">
                Perawat ({users.filter((user) => user.role === 'nurse').length})
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel paddingBottom={4}>
            <TableContainer>
              <Table variant="simple">
                <Thead backgroundColor="brand.50">
                  <Tr>
                    <Th>NIP</Th>
                    <Th>Nama Lengkap</Th>
                    <Th>Domisili</Th>
                    <Th width={200}>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {!!users.filter((u) => u.role === 'nurse' && u.hospital.id === user?.hospital.id)
                    .length ? (
                    users
                      .filter((u) => u.role === 'nurse' && u.hospital.id === user?.hospital.id)
                      .map((user) => (
                        <Tr key={user.id.toText()}>
                          <Td>{user.nip}</Td>
                          <Td>{user.name}</Td>
                          <Td>
                            {user.city}, {user.province}
                          </Td>
                          <Td display="flex" gap={2}>
                            <IconButton
                              aria-label="Verifikasi"
                              colorScheme="green"
                              icon={<FaCheck />}
                              onClick={() => {
                                setUserDetail(user);
                                verifyDialog.onOpen();
                              }}
                            />
                            <IconButton
                              aria-label="Tolak"
                              colorScheme="red"
                              icon={<FaTimes />}
                              onClick={() => {
                                setUserDetail(user);
                                rejectDialog.onOpen();
                              }}
                            />
                            <IconButton
                              aria-label="Detail"
                              colorScheme="brand"
                              icon={<FaInfo />}
                              onClick={() => {
                                setUserDetail(user);
                                detailModal.onOpen();
                              }}
                            />
                          </Td>
                        </Tr>
                      ))
                  ) : (
                    <Tr>
                      <Td textAlign="center" colSpan={4}>
                        Tidak ada akun perawat yang perlu diverifikasi.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton
              _expanded={{
                backgroundColor: 'brand.500',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              <Box as="span" flex="1" textAlign="left">
                Pasien ({users.filter((user) => user.role === 'patient').length})
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel paddingBottom={4}>
            <TableContainer>
              <Table variant="simple">
                <Thead backgroundColor="brand.50">
                  <Tr>
                    <Th>NIK</Th>
                    <Th>Nama Lengkap</Th>
                    <Th>Domisili</Th>
                    <Th width={200}>Aksi</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {!!users.filter((user) => user.role === 'patient').length ? (
                    users
                      .filter((user) => user.role === 'patient')
                      .map((user) => (
                        <Tr key={user.id.toText()}>
                          <Td>{user.nik}</Td>
                          <Td>{user.name}</Td>
                          <Td>
                            {user.city}, {user.province}
                          </Td>
                          <Td display="flex" gap={2}>
                            <IconButton
                              aria-label="Verifikasi"
                              colorScheme="green"
                              icon={<FaCheck />}
                              onClick={() => {
                                setUserDetail(user);
                                verifyDialog.onOpen();
                              }}
                            />
                            <IconButton
                              aria-label="Tolak"
                              colorScheme="red"
                              icon={<FaTimes />}
                              onClick={() => {
                                setUserDetail(user);
                                rejectDialog.onOpen();
                              }}
                            />
                            <IconButton
                              aria-label="Detail"
                              colorScheme="brand"
                              icon={<FaInfo />}
                              onClick={() => {
                                setUserDetail(user);
                                detailModal.onOpen();
                              }}
                            />
                          </Td>
                        </Tr>
                      ))
                  ) : (
                    <Tr>
                      <Td textAlign="center" colSpan={4}>
                        Tidak ada akun pasien yang perlu diverifikasi.
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <ConfirmationAlert
        title="Verifikasi Pengguna"
        description="Apakah Anda yakin ingin memverifikasi pengguna ini?"
        colorScheme="green"
        actionText="Verifikasi"
        loadingText="Memverifikasi"
        isOpen={verifyDialog.isOpen}
        isLoading={isVerifying}
        onConfirm={() => onReviewUser(true)}
        onClose={() => {
          setUserDetail(null);
          verifyDialog.onClose();
        }}
      />

      <ConfirmationAlert
        title="Tolak Pengguna"
        description="Apakah Anda yakin ingin menolak pengguna ini?"
        colorScheme="red"
        actionText="Tolak"
        loadingText="Menolak"
        isOpen={rejectDialog.isOpen}
        isLoading={isRejecting}
        onConfirm={() => onReviewUser(false)}
        onClose={() => {
          setUserDetail(null);
          rejectDialog.onClose();
        }}
      />

      <Modal
        scrollBehavior="inside"
        size="xl"
        closeOnOverlayClick={false}
        isOpen={detailModal.isOpen}
        onClose={detailModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth={2}>Detail Pengguna</ModalHeader>
          <ModalBody padding={6}>
            <Alert status="warning" variant="left-accent" marginBottom={4}>
              <AlertIcon />
              Pastikan data ini valid dan dapat dibuktikan kebenarannya sebelum diverifikasi.
            </Alert>
            <VStack alignItems="start" gap={4}>
              <Text>
                <strong>Peran:</strong>{' '}
                {userDetail?.role === 'doctor'
                  ? 'Dokter'
                  : userDetail?.role === 'nurse'
                  ? 'Perawat'
                  : 'Pasien'}
              </Text>
              {userDetail?.role === 'patient' ? (
                <Text>
                  <strong>NIK:</strong> {userDetail?.nik}
                </Text>
              ) : (
                <Text>
                  <strong>NIP:</strong> {userDetail?.nip}
                </Text>
              )}
              <Text>
                <strong>Nama:</strong> {userDetail?.name}
              </Text>
              {userDetail?.role === 'doctor' && (
                <Text>
                  <strong>Spesialisasi:</strong> {userDetail?.specialization}
                </Text>
              )}
              <Text>
                <strong>Jenis Kelamin:</strong>{' '}
                {userDetail?.gender === 'male' ? 'Laki-Laki' : 'Perempuan'}
              </Text>
              <Text>
                <strong>Umur:</strong> {userDetail?.age}
              </Text>
              <Text>
                <strong>Tempat & Tanggal Lahir:</strong> {userDetail?.birthPlace},{' '}
                {userDetail?.birthDate
                  ? dayjs(nat64ToDate(userDetail?.birthDate)).locale('id').format('DD MMMM YYYY')
                  : ''}
              </Text>
              <Text>
                <strong>Golongan Darah:</strong> {userDetail?.bloodType}
                {userDetail?.bloodRhesus}
              </Text>
              <Text>
                <strong>Agama:</strong> {userDetail?.religion}
              </Text>
              <Text>
                <strong>Alamat:</strong> {userDetail?.address}
              </Text>
              <Text>
                <strong>Kelurahan:</strong> {userDetail?.subDistrict}
              </Text>
              <Text>
                <strong>Kecamatan:</strong> {userDetail?.district}
              </Text>
              <Text>
                <strong>Kota/Kabupaten:</strong> {userDetail?.city}
              </Text>
              <Text>
                <strong>Provinsi:</strong> {userDetail?.province}
              </Text>
              <Text>
                <strong>Kode Pos:</strong> {userDetail?.postalCode}
              </Text>
              <Text>
                <strong>Negara:</strong> {userDetail?.country}
              </Text>
              <Text>
                <strong>Email:</strong> {userDetail?.email}
              </Text>
              <Text>
                <strong>Telepon:</strong> {userDetail?.phone}
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter borderTopWidth={2}>
            <Button
              colorScheme="brand"
              variant="outline"
              onClick={() => {
                setUserDetail(null);
                detailModal.onClose();
              }}
            >
              Tutup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default AdminVerifications;
