'use client';

import { useContext, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaInfo, FaPlus, FaTrash } from 'react-icons/fa';
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
  Textarea,
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
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';

import { AuthContext } from '@/lib/contexts/auth';
import { nat64ToDate } from '@/lib/utils/date';
import { medicalRecordDoctorSchema } from '@/lib/utils/schema';

import type { Result } from 'azle';
import type { InferType } from 'yup';
import type { Appointment, Error, MedicalRecord, User } from '@/contract';

const DoctorMedicalRecords = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [medicalRecordDetail, setMedicalRecordDetail] = useState<MedicalRecord | null>(null);
  const [appointmentDetail, setAppointmentDetail] = useState<Appointment | null>(null);
  const [patientDetail, setPatientDetail] = useState<User | null>(null);

  const { actor } = useContext(AuthContext);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, isValid },
  } = useForm<InferType<typeof medicalRecordDoctorSchema>>({
    mode: 'onChange',
    defaultValues: {
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      education: '',
      prescriptions: [],
    },
    resolver: yupResolver(medicalRecordDoctorSchema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'prescriptions',
  });

  const createModal = useDisclosure();
  const detailModal = useDisclosure();
  const toast = useToast();

  const onUpdateMedicalRecord = async (payload: InferType<typeof medicalRecordDoctorSchema>) => {
    console.log(payload);

    if (!actor) return;

    const result: Result<any, Error> = await actor.updatePatientMedicalRecord(
      medicalRecordDetail?.id || '',
      {
        ...payload,
        height: medicalRecordDetail?.height || 0,
        weight: medicalRecordDetail?.weight || 0,
        bloodPressure: medicalRecordDetail?.bloodPressure || 0,
        temperature: medicalRecordDetail?.temperature || 0,
        pulse: medicalRecordDetail?.pulse || 0,
        respiration: medicalRecordDetail?.respiration || 0,
        prescriptions: payload.prescriptions || [],
      }
    );

    if (result.Ok) {
      const updatedMedicalRecord: Result<any, Error> =
        await actor.getUncompletedMedicalRecordsByDoctor();
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
      .getUncompletedMedicalRecordsByDoctor()
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
              <Th>Status</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {medicalRecords.length ? (
              medicalRecords
                .sort((a, b) => Number(a.appointment.startTime - b.appointment.startTime))
                .map((medicalRecord) => (
                  <Tr key={medicalRecord.id}>
                    <Td>{medicalRecord.patient.name}</Td>
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
                <Td textAlign="center" colSpan={3}>
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
              <FormControl isInvalid={!!errors.subjective} isRequired>
                <FormLabel>Subjektif / Anamnesa</FormLabel>
                <Input type="text" {...register('subjective')} />
                {errors.subjective && (
                  <FormErrorMessage>{errors.subjective.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.objective} isRequired>
                <FormLabel>Objektif / Pemeriksaan Fisik</FormLabel>
                <Input type="text" {...register('objective')} />
                {errors.objective && (
                  <FormErrorMessage>{errors.objective.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.assessment} isRequired>
                <FormLabel>Penilaian / Diagnosa</FormLabel>
                <Input type="text" {...register('assessment')} />
                {errors.assessment && (
                  <FormErrorMessage>{errors.assessment.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.plan} isRequired>
                <FormLabel>Perencanaan</FormLabel>
                <Input type="text" {...register('plan')} />
                {errors.plan && <FormErrorMessage>{errors.plan.message}</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={!!errors.education} isRequired>
                <FormLabel>Edukasi Pasien</FormLabel>
                <Textarea {...register('education')} />
                {errors.education && (
                  <FormErrorMessage>{errors.education.message}</FormErrorMessage>
                )}
              </FormControl>
              {fields.map((field, index) => (
                <FormControl key={field.id} width="full" isRequired>
                  <FormLabel>Resep Obat {index + 1}</FormLabel>
                  <VStack
                    width="full"
                    alignItems="start"
                    spacing={4}
                    padding={4}
                    borderWidth={1}
                    borderRadius={8}
                  >
                    <FormControl isInvalid={!!errors.prescriptions?.[index]?.medicine} isRequired>
                      <FormLabel>Nama Obat</FormLabel>
                      <Input
                        type="text"
                        {...register(`prescriptions.${index}.medicine` as const)}
                        defaultValue={field.medicine}
                      />
                      {errors.prescriptions?.[index]?.medicine && (
                        <FormErrorMessage>
                          {errors.prescriptions?.[index]?.medicine?.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.prescriptions?.[index]?.dosage} isRequired>
                      <FormLabel>Dosis</FormLabel>
                      <Input
                        type="text"
                        {...register(`prescriptions.${index}.dosage` as const)}
                        defaultValue={field.dosage}
                      />
                      {errors.prescriptions?.[index]?.dosage && (
                        <FormErrorMessage>
                          {errors.prescriptions?.[index]?.dosage?.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.prescriptions?.[index]?.amount} isRequired>
                      <FormLabel>Jumlah</FormLabel>
                      <Input
                        type="number"
                        {...register(`prescriptions.${index}.amount` as const)}
                        defaultValue={field.amount}
                      />
                      {errors.prescriptions?.[index]?.amount && (
                        <FormErrorMessage>
                          {errors.prescriptions?.[index]?.amount?.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <FormControl isInvalid={!!errors.prescriptions?.[index]?.note} isRequired>
                      <FormLabel>Catatan</FormLabel>
                      <Textarea
                        defaultValue={field.note}
                        {...register(`prescriptions.${index}.note` as const)}
                      />
                      {errors.prescriptions?.[index]?.note && (
                        <FormErrorMessage>
                          {errors.prescriptions?.[index]?.note?.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    <Button
                      type="button"
                      colorScheme="red"
                      variant="outline"
                      width="full"
                      leftIcon={<FaTrash />}
                      onClick={() => remove(index)}
                    >
                      Hapus Resep Obat
                    </Button>
                  </VStack>
                </FormControl>
              ))}
              <Button
                type="button"
                colorScheme="brand"
                variant="outline"
                width="full"
                leftIcon={<FaPlus />}
                onClick={() =>
                  append({
                    medicine: '',
                    dosage: '',
                    amount: parseInt(''),
                    note: '',
                  })
                }
              >
                Tambah Resep Obat
              </Button>
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

export default DoctorMedicalRecords;
