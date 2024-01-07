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
  Textarea,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  useToast,
  Text,
} from '@chakra-ui/react';
import { Principal } from '@dfinity/principal';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
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

  const createModal = useDisclosure();
  const detailModal = useDisclosure();
  const deleteDialog = useDisclosure();
  const toast = useToast();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const hospital = useWatch({ control, name: 'hospitalId' });
  const specialization = useWatch({ control, name: 'specialization' });
  const doctor = useWatch({ control, name: 'doctorId' });

  const onCreateAppointment = async (payload: InferType<typeof appointmentSchema>) => {
    if (!actor) return;

    try {
      await actor.createAppointment({
        ...payload,
        doctorId: Principal.fromText(payload.doctorId),
        startTime: dateToNat64(payload.startTime),
      });
      const appointments: Result<any, Error> = await actor.getUpcomingCallerAppointments();
      setAppointments(appointments.Ok || []);
      reset();
      createModal.onClose();
      toast({
        title: 'Berhasil membuat janji!',
        description: 'Silakan tunggu konfirmasi dari dokter.',
        status: 'success',
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: 'Gagal membuat janji!',
        description: 'Silakan coba lagi.',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const onDeleteAppointment = async () => {
    if (!actor || !appointmentDetail) return;

    try {
      setIsDeleting(true);

      await actor.deleteAppointment(appointmentDetail.id);
      const appointments: Result<any, Error> = await actor.getUpcomingCallerAppointments();

      setAppointments(appointments.Ok || []);
      onCloseDeleteDialog();
      toast({
        title: 'Berhasil menghapus janji!',
        description: 'Anda telah menghapus janji temu.',
        status: 'success',
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: 'Gagal menghapus janji!',
        description: 'Silakan coba lagi.',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const onOpenDetailModal = async (appointment: Appointment) => {
    if (!actor) return;

    const hospital: Result<any, Error> = await actor.getHospital(appointment.hospitalId);
    const doctor: Result<any, Error> = await actor.getUser(
      Principal.fromText(appointment.doctorId.toText())
    );

    setAppointmentDetail(appointment);
    setHospitalDetail(hospital.Ok || null);
    setDoctorDetail(doctor.Ok || null);
    detailModal.onOpen();
  };

  const onCloseDetailModal = () => {
    setAppointmentDetail(null);
    setHospitalDetail(null);
    setDoctorDetail(null);
    detailModal.onClose();
  };

  const onOpenDeleteDialog = (appointment: Appointment) => {
    setAppointmentDetail(appointment);
    deleteDialog.onOpen();
  };

  const onCloseDeleteDialog = () => {
    setAppointmentDetail(null);
    deleteDialog.onClose();
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
                <Th>Spesialisasi</Th>
                <Th>Tanggal & Waktu</Th>
                <Th>Status</Th>
                <Th>Aksi</Th>
              </Tr>
            </Thead>
            <Tbody>
              {appointments.length ? (
                appointments.map((appointment) => (
                  <Tr key={appointment.id}>
                    <Td>{appointment.specialization}</Td>
                    <Td>
                      {`${dayjs(nat64ToDate(appointment.startTime)).format('DD/MM/YYYY')} @ ${dayjs(
                        nat64ToDate(appointment.startTime)
                      ).format('HH:mm')}-${dayjs(nat64ToDate(appointment.endTime)).format(
                        'HH:mm'
                      )}`}
                    </Td>
                    <Td>{appointment.isApproved ? 'Terkonfirmasi' : 'Menunggu konfirmasi'}</Td>
                    <Td>
                      <HStack>
                        <IconButton
                          aria-label="Appointment detail"
                          colorScheme="brand"
                          icon={<FaInfo />}
                          onClick={() => onOpenDetailModal(appointment)}
                        />
                        {!appointment.isApproved && (
                          <IconButton
                            aria-label="Delete appointment"
                            colorScheme="red"
                            icon={<FaTrash />}
                            onClick={() => onOpenDeleteDialog(appointment)}
                          />
                        )}
                      </HStack>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4} textAlign="center">
                    Tidak ada janji temu
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>

      <Modal
        scrollBehavior="inside"
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
                    filterDate={(date) => {
                      const currentDay = date.getDay();
                      const doctorSchedules = (
                        doctors.find((user) => user.id.toText() === doctor)?.schedules as any
                      )?.[0];
                      return doctorSchedules ? doctorSchedules[currentDay].isActive : false;
                    }}
                    filterTime={(time) => {
                      const currentDay = time.getDay();
                      const currentHours = time.getHours();
                      const currentMinutes = time.getMinutes();
                      const doctorSchedules = (
                        doctors.find((user) => user.id.toText() === doctor)?.schedules as any
                      )?.[0];

                      if (!doctorSchedules[currentDay].isActive) return false;

                      const startHours = +doctorSchedules[currentDay].startTime.split(':')[0];
                      const startMinutes = +doctorSchedules[currentDay].startTime.split(':')[1];
                      const endHours = +doctorSchedules[currentDay].endTime.split(':')[0];
                      const endMinutes = +doctorSchedules[currentDay].endTime.split(':')[1];

                      if (currentHours < startHours || currentHours > endHours) return false;
                      if (currentHours === startHours && currentMinutes < startMinutes)
                        return false;
                      if (currentHours === endHours && currentMinutes > endMinutes - 30)
                        return false;

                      return true;
                    }}
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
        closeOnOverlayClick={false}
        isOpen={detailModal.isOpen}
        onClose={onCloseDetailModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth={2}>Detail Janji Temu</ModalHeader>
          <ModalBody display="flex" flexDirection="column" padding={6} gap={4}>
            <Text>
              <strong>Rumah Sakit:</strong> {hospitalDetail?.name}
            </Text>
            <Text>
              <strong>Dokter:</strong> {doctorDetail?.name}
            </Text>
            <Text>
              <strong>Spesialisasi:</strong> {doctorDetail?.specialization as any}
            </Text>
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
          <ModalFooter borderTopWidth={2}>
            <Button
              type="button"
              colorScheme="brand"
              variant="outline"
              onClick={onCloseDetailModal}
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
        onClose={onCloseDeleteDialog}
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
              onClick={onCloseDeleteDialog}
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
