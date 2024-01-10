'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { FaInfo, FaPlus, FaTrash } from 'react-icons/fa';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Badge,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
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
  Textarea,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { Principal } from '@dfinity/principal';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import dayjs from 'dayjs';

import { SPECIALIZATION_OPTIONS } from '@/lib/constants/options';
import { AuthContext } from '@/lib/contexts/auth';
import { dateToNat64, nat64ToDate } from '@/lib/utils/date';
import { appointmentSchema } from '@/lib/utils/schema';

import type { Result } from 'azle';
import type { InferType } from 'yup';
import type { Appointment, Error, Hospital, User } from '@/contract';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [doctorAppointments, setDoctorAppointments] = useState<Appointment[]>([]);
  const [appointmentDetail, setAppointmentDetail] = useState<Appointment | null>(null);
  const [hospitalDetail, setHospitalDetail] = useState<Hospital | null>(null);
  const [doctorDetail, setDoctorDetail] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const { actor } = useContext(AuthContext);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, isValid },
  } = useForm<InferType<typeof appointmentSchema>>({
    mode: 'onChange',
    defaultValues: {
      hospitalId: '',
      doctorId: '',
      specialization: '',
      startTime: undefined,
      complaint: '',
    },
    resolver: yupResolver(appointmentSchema),
  });

  const doctor = useWatch({ control, name: 'doctorId' });
  const hospital = useWatch({ control, name: 'hospitalId' });
  const specialization = useWatch({ control, name: 'specialization' });
  const cancelRef = useRef(null);
  const createModal = useDisclosure();
  const detailModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const toast = useToast();

  const onCreateAppointment = async (payload: InferType<typeof appointmentSchema>) => {
    if (!actor) return;

    const result: Result<any, Error> = await actor.createAppointment({
      ...payload,
      doctorId: Principal.fromText(payload.doctorId),
      startTime: dateToNat64(payload.startTime),
    });

    if (result.Ok) {
      const updatedAppointments: Result<any, Error> = await actor.getUpcomingCallerAppointments();
      setAppointments(updatedAppointments.Ok || appointments);
      toast({
        title: 'Berhasil membuat janji!',
        description: 'Silakan tunggu konfirmasi dari dokter.',
        status: 'success',
        isClosable: true,
      });
    }
    if (result.Err) {
      toast({
        title: 'Gagal membuat janji!',
        description: Object.values(result.Err)[0],
        status: 'error',
        isClosable: true,
      });
    }

    reset();
    createModal.onClose();
  };

  const onDeleteAppointment = async () => {
    if (!actor || !appointmentDetail) return;

    setIsDeleting(true);

    const result: Result<any, Error> = await actor.deleteAppointment(appointmentDetail.id);

    if (result.Ok) {
      const updatedAppointments: Result<any, Error> = await actor.getUpcomingCallerAppointments();
      setAppointments(updatedAppointments.Ok || appointments);
      toast({
        title: 'Berhasil menghapus janji!',
        description: 'Anda telah menghapus janji temu.',
        status: 'success',
        isClosable: true,
      });
    } else if (result.Err) {
      toast({
        title: 'Gagal menghapus janji!',
        description: Object.values(result.Err)[0],
        status: 'error',
        isClosable: true,
      });
    }
    setAppointmentDetail(null);
    setIsDeleting(false);
    deleteDialog.onClose();
  };

  const filterAppointmentDate = (date: Date) => {
    const currentDay = date.getDay();
    const doctorSchedule = doctors.find((user) => user.id.toText() === doctor)?.schedules[
      currentDay
    ];

    if (!doctorSchedule) return false;

    return doctorSchedule.isActive;
  };

  const filterAppointmentTime = (time: Date) => {
    const currentDay = time.getDay();
    const currentHours = time.getHours();
    const currentMinutes = time.getMinutes();
    const doctorSchedule = doctors.find((user) => user.id.toText() === doctor)?.schedules[
      currentDay
    ];
    const doctorAppointment = doctorAppointments.find(
      (appointment) =>
        dayjs(nat64ToDate(appointment.startTime)).format('DD/MM/YYYY HH:mm') ===
        dayjs(time).format('DD/MM/YYYY HH:mm')
    );

    if (!doctorSchedule?.isActive) return false;
    if (doctorAppointment?.isConfirmed) return false;

    const startHours = +doctorSchedule.startTime.split(':')[0];
    const startMinutes = +doctorSchedule.startTime.split(':')[1];
    const endHours = +doctorSchedule.endTime.split(':')[0];
    const endMinutes = +doctorSchedule.endTime.split(':')[1];

    if (currentHours < startHours || currentHours > endHours) return false;
    if (currentHours === startHours && currentMinutes < startMinutes) return false;
    if (currentHours === endHours && currentMinutes > endMinutes - 30) return false;

    return true;
  };

  useEffect(() => {
    if (!actor) return;
    actor
      .getUpcomingCallerAppointments()
      .then((res: Result<any, Error>) => setAppointments(res.Ok || []));
    actor.getAllHospitals().then((res: Result<any, Error>) => setHospitals(res.Ok || []));
  }, [actor]);

  useEffect(() => {
    if (!actor || !hospital || !specialization) return;
    actor
      .getDoctorsByHospitalAndSpecialization(hospital, specialization)
      .then((res: Result<any, Error>) => setDoctors(res.Ok || []));
  }, [actor, hospital, specialization]);

  useEffect(() => {
    if (!actor || !doctor) return;
    actor
      .getUpcomingDoctorAppointments(Principal.fromText(doctor))
      .then((res: Result<any, Error>) => setDoctorAppointments(res.Ok || []));
  }, [actor, doctor]);

  return (
    <>
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
        <HStack justifyContent="space-between" width="full">
          <Heading as="h3" size="lg" color="brand.500">
            Janji Temu
          </Heading>
          <Button
            colorScheme="brand"
            marginLeft="auto"
            leftIcon={<FaPlus />}
            onClick={createModal.onOpen}
          >
            Buat Janji
          </Button>
        </HStack>
        <TableContainer width="full">
          <Table variant="simple">
            <Thead backgroundColor="brand.50">
              <Tr>
                <Th>Rumah Sakit</Th>
                <Th>Tanggal & Waktu</Th>
                <Th>Status</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {appointments.length ? (
                appointments
                  .sort((a, b) => Number(a.startTime - b.startTime))
                  .map((appointment) => (
                    <Tr key={appointment.id}>
                      <Td>{appointment.hospital.name}</Td>
                      <Td>
                        {`${dayjs(nat64ToDate(appointment.startTime)).format(
                          'DD/MM/YYYY'
                        )} @ ${dayjs(nat64ToDate(appointment.startTime)).format('HH:mm')}-${dayjs(
                          nat64ToDate(appointment.endTime)
                        ).format('HH:mm')}`}
                      </Td>
                      <Td>
                        {appointment.isConfirmed ? (
                          <Badge colorScheme="green">Telah dikonfirmasi</Badge>
                        ) : (
                          <Badge colorScheme="yellow">Menunggu konfirmasi</Badge>
                        )}
                      </Td>
                      <Td display="flex" gap={2}>
                        <IconButton
                          aria-label="Appointment detail"
                          colorScheme="brand"
                          icon={<FaInfo />}
                          onClick={() => {
                            setAppointmentDetail(appointment);
                            setHospitalDetail(appointment.hospital);
                            setDoctorDetail(appointment.doctor);
                            detailModal.onOpen();
                          }}
                        />
                        {!appointment.isConfirmed && (
                          <IconButton
                            aria-label="Delete appointment"
                            colorScheme="red"
                            icon={<FaTrash />}
                            onClick={() => {
                              setAppointmentDetail(appointment);
                              deleteDialog.onOpen();
                            }}
                          />
                        )}
                      </Td>
                    </Tr>
                  ))
              ) : (
                <Tr>
                  <Td colSpan={4} textAlign="center">
                    Tidak ada janji temu yang akan datang.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>

      <Modal
        scrollBehavior="inside"
        size="xl"
        closeOnOverlayClick={false}
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onCreateAppointment)}>
          <ModalHeader borderBottomWidth={2}>Buat Janji Temu</ModalHeader>
          <ModalBody display="flex" flexDirection="column" padding={6} gap={4}>
            <FormControl isInvalid={!!errors.hospitalId} isRequired>
              <FormLabel>Rumah Sakit</FormLabel>
              <Controller
                control={control}
                name="hospitalId"
                defaultValue=""
                render={({ field: { value, onChange, ...rest } }) => (
                  <Select
                    placeholder="Pilih rumah sakit"
                    options={hospitals.map((hospital) => ({
                      value: hospital.id,
                      label: hospital.name,
                    }))}
                    value={
                      hospitals.find((hospital) => hospital.id === value)
                        ? {
                            value,
                            label: hospitals.find((hospital) => hospital.id === value)?.name,
                          }
                        : null
                    }
                    onChange={(option) => onChange(option?.value || '')}
                    {...rest}
                  />
                )}
              />
              {errors.hospitalId && (
                <FormErrorMessage>{errors.hospitalId.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.specialization} isRequired>
              <FormLabel>Spesialisasi</FormLabel>
              <Controller
                control={control}
                name="specialization"
                defaultValue=""
                render={({ field: { value, onChange, ...rest } }) => (
                  <Select
                    placeholder="Pilih spesialisasi"
                    isDisabled={!hospital}
                    options={SPECIALIZATION_OPTIONS}
                    value={SPECIALIZATION_OPTIONS.find((option) => option.value === value) || null}
                    onChange={(option) => onChange(option?.value || '')}
                    {...rest}
                  />
                )}
              />
              {errors.specialization && (
                <FormErrorMessage>{errors.specialization.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.doctorId} isRequired>
              <FormLabel>Dokter</FormLabel>
              <Controller
                control={control}
                name="doctorId"
                defaultValue=""
                render={({ field: { value, onChange, ...rest } }) => (
                  <Select
                    placeholder="Pilih dokter"
                    isDisabled={!specialization}
                    options={doctors.map((doctor) => ({
                      value: doctor.id.toText(),
                      label: doctor.name,
                    }))}
                    value={
                      doctors.find((doctor) => doctor.id.toText() === value)
                        ? {
                            value,
                            label: doctors.find((doctor) => doctor.id.toText() === value)?.name,
                          }
                        : null
                    }
                    onChange={(option) => onChange(option?.value || '')}
                    {...rest}
                  />
                )}
              />
              {errors.doctorId && <FormErrorMessage>{errors.doctorId.message}</FormErrorMessage>}
            </FormControl>
            <FormControl isInvalid={!!errors.startTime} isRequired>
              <FormLabel>Tanggal & Waktu</FormLabel>
              <Controller
                control={control}
                name="startTime"
                defaultValue={undefined}
                render={({ field: { value, onChange, ...rest } }) => (
                  <DatePicker
                    showTimeSelect
                    dateFormat="dd/MM/yyyy HH:mm"
                    minDate={new Date()}
                    selected={value}
                    readOnly={!doctor}
                    disabled={!doctor}
                    filterDate={(date) => filterAppointmentDate(date)}
                    filterTime={(time) => filterAppointmentTime(time)}
                    onChange={onChange}
                    {...rest}
                  />
                )}
              />
              {errors.startTime && <FormErrorMessage>{errors.startTime.message}</FormErrorMessage>}
            </FormControl>
            <FormControl isInvalid={!!errors.complaint} isRequired>
              <FormLabel>Keluhan</FormLabel>
              <Textarea isDisabled={!doctor} {...register('complaint')} />
              {errors.complaint && <FormErrorMessage>{errors.complaint.message}</FormErrorMessage>}
            </FormControl>
          </ModalBody>
          <ModalFooter borderTopWidth={2}>
            <Button
              type="submit"
              colorScheme="brand"
              loadingText="Membuat"
              marginRight={2}
              isLoading={isSubmitting}
              isDisabled={!isDirty || !isValid}
            >
              Buat Janji
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
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        scrollBehavior="inside"
        size="lg"
        closeOnOverlayClick={false}
        isOpen={detailModal.isOpen}
        onClose={detailModal.onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth={2}>Detail Janji Temu</ModalHeader>
          <ModalBody display="flex" flexDirection="column" padding={6} gap={4}>
            {appointmentDetail?.isConfirmed && (
              <Alert status="warning" variant="left-accent">
                <AlertIcon />
                Mohon untuk datang 15 menit sebelum jadwal mulai.
              </Alert>
            )}
            <Text>
              <strong>Rumah Sakit:</strong> {hospitalDetail?.name}
            </Text>
            <Text>
              <strong>Nama Dokter:</strong> {doctorDetail?.name}
            </Text>
            <Text>
              <strong>Spesialisasi:</strong> {doctorDetail?.specialization as any}
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
          </ModalBody>
          <ModalFooter borderTopWidth={2}>
            <Button
              type="button"
              colorScheme="brand"
              variant="outline"
              onClick={() => {
                setAppointmentDetail(null);
                setHospitalDetail(null);
                setDoctorDetail(null);
                detailModal.onClose();
              }}
            >
              Tutup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        closeOnOverlayClick={false}
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Hapus Janji Temu</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>Apakah Anda yakin ingin menghapus janji ini?</AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef}
              colorScheme="brand"
              variant="outline"
              marginRight={2}
              isDisabled={isDeleting}
              onClick={() => {
                setAppointmentDetail(null);
                deleteDialog.onClose();
              }}
            >
              Batal
            </Button>
            <Button
              colorScheme="red"
              loadingText="Menghapus"
              isLoading={isDeleting}
              onClick={onDeleteAppointment}
            >
              Hapus
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PatientAppointments;
