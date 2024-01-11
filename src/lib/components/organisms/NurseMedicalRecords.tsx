'use client';

import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaInfo, FaPlus } from 'react-icons/fa';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  VStack,
  Heading,
  Badge,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';

import { AuthContext } from '@/lib/contexts/auth';
import { nat64ToDate } from '@/lib/utils/date';
import { medicalRecordNurseSchema } from '@/lib/utils/schema';

import type { Result } from 'azle';
import type { InferType } from 'yup';
import type { Appointment, Error, MedicalRecord, User } from '@/contract';

const NurseMedicalRecords = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [medicalRecordDetail, setMedicalRecordDetail] = useState<MedicalRecord | null>(null);
  const [appointmentDetail, setAppointmentDetail] = useState<Appointment | null>(null);
  const [patientDetail, setPatientDetail] = useState<User | null>(null);

  const { actor } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, isValid },
  } = useForm<InferType<typeof medicalRecordNurseSchema>>({
    mode: 'onChange',
    defaultValues: {
      height: parseInt(''),
      weight: parseInt(''),
      bloodPressure: parseInt(''),
      pulse: parseInt(''),
      temperature: parseInt(''),
      respiration: parseInt(''),
    },
    resolver: yupResolver(medicalRecordNurseSchema),
  });

  const createModal = useDisclosure();
  const detailModal = useDisclosure();
  const toast = useToast();

  const onUpdateMedicalRecord = async (payload: InferType<typeof medicalRecordNurseSchema>) => {
    if (!actor) return;

    const result: Result<any, Error> = await actor.updatePatientMedicalRecord(
      medicalRecordDetail?.id || '',
      {
        ...payload,
        subjective: medicalRecordDetail?.subjective || '',
        objective: medicalRecordDetail?.objective || '',
        assessment: medicalRecordDetail?.assessment || '',
        plan: medicalRecordDetail?.plan || '',
        education: medicalRecordDetail?.education || '',
        prescriptions: medicalRecordDetail?.prescriptions || [],
      }
    );

    if (result.Ok) {
      const updatedMedicalRecord: Result<any, Error> =
        await actor.getUncompletedMedicalRecordsByNurse();
      setMedicalRecords(updatedMedicalRecord.Ok || []);
      toast({
        title: 'Berhasil mengkaji rekam medis!',
        description: 'Rekam medis telah dikaji.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else if (result.Err) {
      toast({
        title: 'Gagal mengkaji rekam medis!',
        description: Object.values(result.Err)[0],
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    setMedicalRecordDetail(null);
    setAppointmentDetail(null);
    setPatientDetail(null);
    reset();
    createModal.onClose();
  };

  useEffect(() => {
    if (!actor) return;
    actor
      .getUncompletedMedicalRecordsByNurse()
      .then((res: Result<any, Error>) => setMedicalRecords(res.Ok || []));
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
        Rekam Medis
      </Heading>
      <TableContainer width="full">
        <Table variant="simple">
          <Thead backgroundColor="brand.50">
            <Tr>
              <Th>Nama Pasien</Th>
              <Th>Tanggal & Waktu</Th>
              <Th>Status</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!!medicalRecords.length ? (
              medicalRecords
                .sort((a, b) => Number(a.appointment.startTime - b.appointment.startTime))
                .map((medicalRecord) => (
                  <Tr key={medicalRecord.id}>
                    <Td>{medicalRecord.patient.name}</Td>
                    <Td>
                      {`${dayjs(nat64ToDate(medicalRecord.appointment.startTime)).format(
                        'DD/MM/YYYY'
                      )} @ ${dayjs(nat64ToDate(medicalRecord.appointment.startTime)).format(
                        'HH:mm'
                      )}-${dayjs(nat64ToDate(medicalRecord.appointment.endTime)).format('HH:mm')}`}
                    </Td>
                    <Td>
                      <Badge colorScheme="yellow">Belum Dikaji</Badge>
                    </Td>
                    <Td display="flex" gap={2}>
                      <IconButton
                        aria-label="Buat"
                        colorScheme="green"
                        icon={<FaPlus />}
                        onClick={() => {
                          setMedicalRecordDetail(medicalRecord);
                          setAppointmentDetail(medicalRecord.appointment);
                          setPatientDetail(medicalRecord.patient);
                          createModal.onOpen();
                        }}
                      />
                      <IconButton
                        aria-label="Detail"
                        colorScheme="brand"
                        icon={<FaInfo />}
                        onClick={() => {
                          setMedicalRecordDetail(medicalRecord);
                          setAppointmentDetail(medicalRecord.appointment);
                          setPatientDetail(medicalRecord.patient);
                          detailModal.onOpen();
                        }}
                      />
                    </Td>
                  </Tr>
                ))
            ) : (
              <Tr>
                <Td textAlign="center" colSpan={4}>
                  Tidak ada rekam medis yang belum dikaji.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Modal
        scrollBehavior="inside"
        size="xl"
        closeOnOverlayClick={false}
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onUpdateMedicalRecord)}>
          <ModalHeader borderBottomWidth={2}>Buat Rekam Medis</ModalHeader>
          <ModalBody display="flex" flexDirection="column" padding={6} gap={4}>
            <VStack width="full" alignItems="start" spacing={4}>
              <FormControl isInvalid={!!errors.height} isRequired>
                <FormLabel>Tinggi Badan</FormLabel>
                <InputGroup>
                  <Input type="number" {...register('height')} />
                  <InputRightAddon>cm</InputRightAddon>
                </InputGroup>
                {errors.height && <FormErrorMessage>{errors.height.message}</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={!!errors.weight} isRequired>
                <FormLabel>Berat Badan</FormLabel>
                <InputGroup>
                  <Input type="number" {...register('weight')} />
                  <InputRightAddon>kg</InputRightAddon>
                </InputGroup>
                {errors.weight && <FormErrorMessage>{errors.weight.message}</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={!!errors.bloodPressure} isRequired>
                <FormLabel>Tekanan Darah</FormLabel>
                <InputGroup>
                  <Input type="number" {...register('bloodPressure')} />
                  <InputRightAddon>mmHg</InputRightAddon>
                </InputGroup>
                {errors.bloodPressure && (
                  <FormErrorMessage>{errors.bloodPressure.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.pulse} isRequired>
                <FormLabel>Nadi</FormLabel>
                <InputGroup>
                  <Input type="number" {...register('pulse')} />
                  <InputRightAddon>x/menit</InputRightAddon>
                </InputGroup>
                {errors.pulse && <FormErrorMessage>{errors.pulse.message}</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={!!errors.temperature} isRequired>
                <FormLabel>Suhu</FormLabel>
                <InputGroup>
                  <Input type="number" {...register('temperature')} />
                  <InputRightAddon>&deg;C</InputRightAddon>
                </InputGroup>
                {errors.temperature && (
                  <FormErrorMessage>{errors.temperature.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.respiration} isRequired>
                <FormLabel>Respirasi</FormLabel>
                <InputGroup>
                  <Input type="number" {...register('respiration')} />
                  <InputRightAddon>x/menit</InputRightAddon>
                </InputGroup>
                {errors.respiration && (
                  <FormErrorMessage>{errors.respiration.message}</FormErrorMessage>
                )}
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter borderTopWidth={2}>
            <Button
              type="submit"
              colorScheme="green"
              loadingText="Mengkaji"
              marginRight={2}
              isLoading={isSubmitting}
              isDisabled={!isDirty || !isValid}
            >
              Kaji Rekam Medis
            </Button>
            <Button
              type="button"
              colorScheme="brand"
              variant="outline"
              onClick={() => {
                reset();
                createModal.onClose();
              }}
            >
              Tutup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
          <ModalHeader borderBottomWidth={2}>Detail Rekam Medis</ModalHeader>
          <ModalBody display="flex" flexDirection="column" padding={6} gap={4}>
            <Heading as="h4" size="md" color="brand.500" marginTop={4}>
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
              <strong>Status:</strong> Telah diperiksa
            </Text>
            <Heading as="h4" size="md" color="brand.500">
              Informasi Pasien
            </Heading>
            <Text>
              <strong>Nama Pasien:</strong> {patientDetail?.name}
            </Text>
            <Text>
              <strong>Umur:</strong> {patientDetail?.age}
            </Text>
            <Text>
              <strong>Tempat & Tanggal Lahir:</strong> {patientDetail?.birthPlace},{' '}
              {patientDetail?.birthDate
                ? dayjs(nat64ToDate(patientDetail.birthDate)).locale('id').format('DD MMMM YYYY')
                : ''}
            </Text>
            <Text>
              <strong>Jenis Kelamin:</strong>{' '}
              {patientDetail?.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
            </Text>
            <Text>
              <strong>Golongan Darah:</strong> {patientDetail?.bloodType}
              {patientDetail?.bloodRhesus}
            </Text>
          </ModalBody>
          <ModalFooter borderTopWidth={2}>
            <Button
              type="button"
              colorScheme="brand"
              variant="outline"
              onClick={() => {
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

export default NurseMedicalRecords;
