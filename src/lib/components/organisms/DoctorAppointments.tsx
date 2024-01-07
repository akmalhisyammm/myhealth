'use client';

import { useContext, useEffect, useState } from 'react';
import { FaInfo } from 'react-icons/fa';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  useDisclosure,
  IconButton,
  Heading,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Principal } from '@dfinity/principal';
import dayjs from 'dayjs';

import { AuthContext } from '@/lib/contexts/auth';
import { nat64ToDate } from '@/lib/utils/date';

import type { Result } from 'azle';
import type { Appointment, Error, User } from '@/contract';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientDetail, setPatientDetail] = useState<User | null>(null);
  const [appointmentDetail, setAppointmentDetail] = useState<Appointment | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);

  const { actor } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const onOpenDetail = async (appointment: Appointment) => {
    if (!actor) return;

    const patient: Result<any, Error> = await actor.getUser(
      Principal.fromText(appointment.patientId.toText())
    );

    setPatientDetail(patient.Ok || null);
    setAppointmentDetail(appointment);
    onOpen();
  };

  const onCloseDetail = () => {
    setPatientDetail(null);
    setAppointmentDetail(null);
    onClose();
  };

  const onConfirmAppointment = async () => {
    if (!actor || !appointmentDetail) return;

    setIsConfirming(true);

    const result: Result<any, Error> = await actor.reviewAppointment(appointmentDetail.id, true);

    if (!result.Ok) {
      setIsConfirming(false);
      return toast({
        title: 'Gagal mengonfirmasi janji!',
        description: 'Terjadi kesalahan, silakan coba lagi.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    toast({
      title: 'Berhasil mengonfirmasi janji!',
      description: 'Janji temu telah dikonfirmasi.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === result.Ok.id) {
        return { ...appointment, isApproved: true };
      }
      return appointment;
    });

    setAppointments(updatedAppointments);
    setIsConfirming(false);
    onCloseDetail();
  };

  const onRejectAppointment = async () => {
    if (!actor || !appointmentDetail) return;

    setIsRejecting(true);

    const result: Result<any, Error> = await actor.reviewAppointment(appointmentDetail.id, false);

    if (!result.Ok) {
      setIsRejecting(false);
      return toast({
        title: 'Gagal menolak janji!',
        description: 'Terjadi kesalahan, silakan coba lagi.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    toast({
      title: 'Berhasil menolak janji!',
      description: 'Janji temu telah ditolak.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    const updatedAppointments = appointments.filter(
      (appointment) => appointment.id !== result.Ok.id
    );

    setAppointments(updatedAppointments);
    setIsRejecting(false);
    onCloseDetail();
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
      {appointments.length ? (
        <Accordion width="full" defaultIndex={[0]} allowMultiple>
          {appointments
            .sort((a, b) =>
              dayjs(nat64ToDate(a.startTime)).isAfter(dayjs(nat64ToDate(b.startTime))) ? 1 : -1
            )
            .filter(
              (appointment, index, self) =>
                index ===
                self.findIndex(
                  (t) =>
                    dayjs(nat64ToDate(t.startTime)).format('DD/MM/YYYY') ===
                    dayjs(nat64ToDate(appointment.startTime)).format('DD/MM/YYYY')
                )
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
                        .format('dddd, DD MMMM YYYY')}
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
                          <Th>Aksi</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {appointments
                          .filter(
                            (t) =>
                              dayjs(nat64ToDate(t.startTime)).format('DD/MM/YYYY') ===
                              dayjs(nat64ToDate(appointment.startTime)).format('DD/MM/YYYY')
                          )
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
                                {appointment.isApproved ? 'Terkonfirmasi' : 'Menunggu konfirmasi'}
                              </Td>
                              <Td>
                                <IconButton
                                  aria-label="Detail"
                                  colorScheme="brand"
                                  icon={<FaInfo />}
                                  onClick={() => onOpenDetail(appointment)}
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
        <Text>Tidak ada janji temu.</Text>
      )}

      <Modal
        scrollBehavior="inside"
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onCloseDetail}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth={2}>Detail Janji Temu</ModalHeader>
          <ModalBody display="flex" flexDirection="column" padding={6} gap={4}>
            <Heading as="h4" size="md">
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
              <strong>Domisili:</strong> {patientDetail?.city}
            </Text>
            <Text>
              <strong>Telepon:</strong> {patientDetail?.phone}
            </Text>
            <Text>
              <strong>Email:</strong> {patientDetail?.email}
            </Text>
            <Heading as="h4" size="md" marginTop={4}>
              Informasi Janji Temu
            </Heading>
            <Text>
              <strong>Tanggal & Waktu:</strong>{' '}
              {appointmentDetail?.startTime
                ? `${dayjs(nat64ToDate(appointmentDetail.startTime)).format(
                    'DD/MM/YYYY'
                  )} @ ${dayjs(nat64ToDate(appointmentDetail.startTime)).format('HH:mm')}-${dayjs(
                    nat64ToDate(appointmentDetail.endTime)
                  ).format('HH:mm')}`
                : ''}
            </Text>
            <Text>
              <strong>Keluhan:</strong> {appointmentDetail?.complaint}
            </Text>
            <Text>
              <strong>Status:</strong>{' '}
              {appointmentDetail?.isApproved ? 'Terkonfirmasi' : 'Menunggu konfirmasi'}
            </Text>
          </ModalBody>
          {appointmentDetail?.isApproved ? (
            <ModalFooter borderTopWidth={2}>
              <Button colorScheme="brand" variant="outline" onClick={onCloseDetail}>
                Tutup
              </Button>
            </ModalFooter>
          ) : (
            <ModalFooter borderTopWidth={2}>
              <Button
                colorScheme="brand"
                loadingText="Mengonfirmasi"
                isLoading={isConfirming}
                isDisabled={isConfirming || isRejecting}
                marginRight={2}
                onClick={onConfirmAppointment}
              >
                Konfirmasi
              </Button>
              <Button
                colorScheme="red"
                loadingText="Menolak"
                isLoading={isRejecting}
                isDisabled={isConfirming || isRejecting}
                onClick={onRejectAppointment}
              >
                Tolak
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default DoctorAppointments;
