'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaCheck, FaFileAlt, FaInfo, FaTimes } from 'react-icons/fa';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
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
  TableContainer,
  Table,
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
import dayjs from 'dayjs';

import { AuthContext } from '@/lib/contexts/auth';
import { ConfirmationAlert } from '@/lib/components/molecules';
import { nat64ToDate } from '@/lib/utils/date';

import type { Result } from 'azle';
import type { Appointment, Error, User } from '@/contract';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentDetail, setAppointmentDetail] = useState<Appointment | null>(null);
  const [patientDetail, setPatientDetail] = useState<User | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  const { actor } = useContext(AuthContext);

  const detailModal = useDisclosure();
  const confirmDialog = useDisclosure();
  const rejectDialog = useDisclosure();
  const router = useRouter();
  const toast = useToast();

  const onReviewAppointment = async (isConfirmed: boolean) => {
    if (!actor || !appointmentDetail) return;

    isConfirmed ? setIsConfirming(true) : setIsRejecting(true);

    const result: Result<any, Error> = await actor.reviewAppointment(
      appointmentDetail.id,
      isConfirmed
    );

    if (result.Ok) {
      const updatedAppointments: Result<any, Error> = await actor.getUpcomingCallerAppointments();
      setAppointments(updatedAppointments.Ok || appointments);
      toast({
        title: isConfirmed ? 'Berhasil mengonfirmasi janji!' : 'Berhasil menolak janji!',
        description: isConfirmed ? 'Janji temu telah dikonfirmasi.' : 'Janji temu telah ditolak.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else if (result.Err) {
      toast({
        title: isConfirmed ? 'Gagal mengonfirmasi janji!' : 'Gagal menolak janji!',
        description: Object.values(result.Err)[0],
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setAppointmentDetail(null);
    setIsConfirming(false);
    setIsRejecting(false);
    confirmDialog.onClose();
    rejectDialog.onClose();
  };

  useEffect(() => {
    if (!actor) return;
    actor
      .getUpcomingCallerAppointments()
      .then((res: Result<any, Error>) => setAppointments(res.Ok || []));
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
        Janji Temu
      </Heading>

      {!!appointments.length ? (
        <Accordion width="full" defaultIndex={[0]} allowMultiple>
          {appointments
            .filter(
              (appointment, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    dayjs(nat64ToDate(t.startTime)).format('DD/MM/YYYY') ===
                    dayjs(nat64ToDate(appointment.startTime)).format('DD/MM/YYYY')
                )
            )
            .sort((a, b) =>
              dayjs(nat64ToDate(a.startTime)).isAfter(dayjs(nat64ToDate(b.startTime))) ? 1 : -1
            )
            .map((appointment) => (
              <AccordionItem key={appointment.id}>
                <h2>
                  <AccordionButton
                    _expanded={{
                      backgroundColor: 'brand.500',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    <Box as="span" flex="1" textAlign="left">
                      {dayjs(nat64ToDate(appointment.startTime))
                        .locale('id')
                        .format('dddd, DD MMMM YYYY')}{' '}
                      (
                      {
                        appointments.filter(
                          (t) =>
                            dayjs(nat64ToDate(t.startTime)).format('DD/MM/YYYY') ===
                            dayjs(nat64ToDate(appointment.startTime)).format('DD/MM/YYYY')
                        ).length
                      }
                      )
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel paddingBottom={4}>
                  <TableContainer>
                    <Table variant="simple">
                      <Thead backgroundColor="brand.50">
                        <Tr>
                          <Th>Tanggal & Waktu</Th>
                          <Th>Status</Th>
                          <Th width={200}>Aksi</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {appointments
                          .filter(
                            (t) =>
                              dayjs(nat64ToDate(t.startTime)).format('DD/MM/YYYY') ===
                              dayjs(nat64ToDate(appointment.startTime)).format('DD/MM/YYYY')
                          )
                          .sort((a, b) => Number(a.startTime - b.startTime))
                          .map((appointment) => (
                            <Tr key={appointment.id}>
                              <Td>
                                {`${dayjs(nat64ToDate(appointment.startTime)).format(
                                  'DD/MM/YYYY'
                                )} @ ${dayjs(nat64ToDate(appointment.startTime)).format(
                                  'HH:mm'
                                )}-${dayjs(nat64ToDate(appointment.endTime)).format('HH:mm')}`}
                              </Td>
                              <Td>
                                {appointment.isConfirmed ? (
                                  <Badge colorScheme="green">Telah dikonfirmasi</Badge>
                                ) : (
                                  <Badge colorScheme="yellow">Menunggu konfirmasi</Badge>
                                )}
                              </Td>
                              <Td display="flex" gap={2}>
                                {!appointment.isConfirmed && (
                                  <>
                                    <IconButton
                                      aria-label="Konfirmasi"
                                      colorScheme="green"
                                      icon={<FaCheck />}
                                      onClick={() => {
                                        setAppointmentDetail(appointment);
                                        confirmDialog.onOpen();
                                      }}
                                    />
                                    <IconButton
                                      aria-label="Tolak"
                                      colorScheme="red"
                                      icon={<FaTimes />}
                                      onClick={() => {
                                        setAppointmentDetail(appointment);
                                        rejectDialog.onOpen();
                                      }}
                                    />
                                  </>
                                )}
                                <IconButton
                                  aria-label="Detail"
                                  colorScheme="brand"
                                  icon={<FaInfo />}
                                  onClick={() => {
                                    setAppointmentDetail(appointment);
                                    setPatientDetail(appointment.patient);
                                    detailModal.onOpen();
                                  }}
                                />
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </AccordionPanel>
              </AccordionItem>
            ))}
        </Accordion>
      ) : (
        <Text>Tidak ada janji temu yang akan datang.</Text>
      )}

      <ConfirmationAlert
        title="Konfirmasi Janji Temu"
        description="Apakah Anda yakin ingin mengonfirmasi janji ini?"
        colorScheme="green"
        actionText="Konfirmasi"
        loadingText="Mengonfirmasi"
        isOpen={confirmDialog.isOpen}
        isLoading={isConfirming}
        onConfirm={() => onReviewAppointment(true)}
        onClose={() => {
          setAppointmentDetail(null);
          confirmDialog.onClose();
        }}
      />

      <ConfirmationAlert
        title="Tolak Janji Temu"
        description="Apakah Anda yakin ingin menolak janji ini?"
        colorScheme="red"
        actionText="Tolak"
        loadingText="Menolak"
        isOpen={rejectDialog.isOpen}
        isLoading={isRejecting}
        onConfirm={() => onReviewAppointment(false)}
        onClose={() => {
          setAppointmentDetail(null);
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
          <ModalHeader borderBottomWidth={2}>Detail Janji Temu</ModalHeader>
          <ModalBody padding={6}>
            <VStack alignItems="start" gap={4}>
              <Heading as="h4" size="md" color="brand.500">
                Informasi Janji Temu
              </Heading>
              <Text>
                <strong>Rumah Sakit:</strong> {appointmentDetail?.hospital.name}
              </Text>
              <Text>
                <strong>Tanggal & Waktu:</strong>{' '}
                {appointmentDetail?.startTime
                  ? `${dayjs(nat64ToDate(appointmentDetail?.startTime))
                      .locale('id')
                      .format('D MMMM YYYY')} @ ${dayjs(
                      nat64ToDate(appointmentDetail?.startTime)
                    ).format('HH:mm')}-${dayjs(nat64ToDate(appointmentDetail?.endTime)).format(
                      'HH:mm'
                    )}`
                  : ''}
              </Text>
              <Text>
                <strong>Keluhan:</strong> {appointmentDetail?.complaint}
              </Text>
              <Text>
                <strong>Status:</strong>{' '}
                {appointmentDetail?.isConfirmed ? 'Telah dikonfirmasi' : 'Menunggu konfirmasi'}
              </Text>
              <Heading as="h4" size="md" color="brand.500" marginTop={4}>
                Informasi Pasien
              </Heading>
              <Text>
                <strong>Nama:</strong> {patientDetail?.name}
              </Text>
              <Text>
                <strong>Umur:</strong> {patientDetail?.age}{' '}
              </Text>
              <Text>
                <strong>Jenis Kelamin:</strong>{' '}
                {patientDetail?.gender === 'male' ? 'Laki-Laki' : 'Perempuan'}
              </Text>
              <Text>
                <strong>Golongan Darah:</strong> {patientDetail?.bloodType}
                {patientDetail?.bloodRhesus}
              </Text>
              <Text>
                <strong>Domisili:</strong> {patientDetail?.city}, {patientDetail?.province}
              </Text>
              <Text>
                <strong>Email:</strong> {patientDetail?.email}
              </Text>
              <Text>
                <strong>Telepon:</strong> {patientDetail?.phone}
              </Text>
              <Button
                width="full"
                colorScheme="brand"
                leftIcon={<FaFileAlt />}
                onClick={() =>
                  router.push(`/main/medical-records?patientId=${patientDetail?.id.toText()}`)
                }
              >
                Lihat Rekam Medis
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter borderTopWidth={2}>
            <Button
              colorScheme="brand"
              variant="outline"
              onClick={() => {
                setAppointmentDetail(null);
                setPatientDetail(null);
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

export default DoctorAppointments;
