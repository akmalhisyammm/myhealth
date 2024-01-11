'use client';

import { useContext, useEffect, useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import {
  Badge,
  Box,
  Button,
  Heading,
  IconButton,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Text,
  UnorderedList,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

import { AuthContext } from '@/lib/contexts/auth';
import { nat64ToDate } from '@/lib/utils/date';

import type { Result } from 'azle';
import type { Appointment, Error, MedicalRecord, User } from '@/contract';
import { Principal } from '@dfinity/principal';

type PatientMedicalRecordsProps = {
  id?: string;
};

const PatientMedicalRecords = ({ id }: PatientMedicalRecordsProps) => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [medicalRecordDetail, setMedicalRecordDetail] = useState<MedicalRecord | null>(null);
  const [appointmentDetail, setAppointmentDetail] = useState<Appointment | null>(null);
  const [patientDetail, setPatientDetail] = useState<User | null>(null);

  const { actor } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!actor) return;
    !!id
      ? actor.getUser(Principal.fromText(id)).then((res: Result<any, Error>) => {
          if (res.Ok) {
            setPatientDetail(res.Ok);
            actor
              .getPatientMedicalRecords(res.Ok.id)
              .then((res: Result<any, Error>) => setMedicalRecords(res.Ok || []));
          }
        })
      : actor
          .getCallerMedicalRecords()
          .then((res: Result<any, Error>) => setMedicalRecords(res.Ok || []));
  }, [actor, id]);

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
      {!!id && (
        <>
          <Text>
            <strong>ID Pasien:</strong> {id}
          </Text>
          <Text>
            <strong>Nama Pasien:</strong> {patientDetail?.name}
          </Text>
        </>
      )}
      <TableContainer width="full">
        <Table variant="simple">
          <Thead backgroundColor="brand.50">
            <Tr>
              <Th>Rumah Sakit</Th>
              <Th>Tanggal & Waktu</Th>
              <Th>Status</Th>
              <Th width={200}>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!!medicalRecords.length ? (
              medicalRecords
                .sort((a, b) => Number(a.appointment.startTime - b.appointment.startTime))
                .map((medicalRecord) => (
                  <Tr key={medicalRecord.id}>
                    <Td>{medicalRecord.hospital.name}</Td>
                    <Td>
                      {`${dayjs(nat64ToDate(medicalRecord.appointment.startTime)).format(
                        'DD/MM/YYYY'
                      )} @ ${dayjs(nat64ToDate(medicalRecord.appointment.startTime)).format(
                        'HH:mm'
                      )}-${dayjs(nat64ToDate(medicalRecord.appointment.endTime)).format('HH:mm')}`}
                    </Td>
                    <Td>
                      {medicalRecord.height &&
                      medicalRecord.weight &&
                      medicalRecord.bloodPressure &&
                      medicalRecord.pulse &&
                      medicalRecord.respiration &&
                      medicalRecord.temperature &&
                      medicalRecord.subjective &&
                      medicalRecord.objective &&
                      medicalRecord.assessment &&
                      medicalRecord.plan &&
                      medicalRecord.education &&
                      !!medicalRecord.prescriptions.length ? (
                        <Badge colorScheme="green">Telah Dikaji</Badge>
                      ) : (
                        <Badge colorScheme="yellow">Menunggu Kajian</Badge>
                      )}
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="Detail"
                        colorScheme="brand"
                        icon={<FaFileAlt />}
                        onClick={() => {
                          setMedicalRecordDetail(medicalRecord);
                          setAppointmentDetail(medicalRecord.appointment);
                          onOpen();
                        }}
                      />
                    </Td>
                  </Tr>
                ))
            ) : (
              <Tr>
                <Td textAlign="center" colSpan={4}>
                  Tidak ada rekam medis.
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
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth={2}>Resume Medis</ModalHeader>
          <ModalBody display="flex" flexDirection="column" padding={6} gap={4}>
            <Heading as="h4" size="md" color="brand.500">
              Informasi Janji Temu
            </Heading>
            <Text>
              <strong>Nama Dokter:</strong> {appointmentDetail?.doctor.name}
            </Text>
            <Text>
              <strong>Spesialisasi:</strong> {appointmentDetail?.specialization}
            </Text>
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
            <Heading as="h4" size="md" color="brand.500" marginTop={4}>
              Tanda-Tanda Vital (TTV)
            </Heading>
            <Text>
              <strong>Tinggi:</strong>{' '}
              {medicalRecordDetail?.height ? medicalRecordDetail?.height + ' cm' : '-'}
            </Text>
            <Text>
              <strong>Berat:</strong>{' '}
              {medicalRecordDetail?.weight ? medicalRecordDetail?.weight + ' kg' : '-'}
            </Text>
            <Text>
              <strong>Tekanan Darah:</strong>{' '}
              {medicalRecordDetail?.bloodPressure
                ? medicalRecordDetail?.bloodPressure + ' mmHg'
                : '-'}
            </Text>
            <Text>
              <strong>Nadi:</strong>{' '}
              {medicalRecordDetail?.pulse ? medicalRecordDetail?.pulse + ' x/menit' : '-'}
            </Text>
            <Text>
              <strong>Respirasi:</strong>{' '}
              {medicalRecordDetail?.respiration
                ? medicalRecordDetail?.respiration + ' x/menit'
                : '-'}
            </Text>
            <Text>
              <strong>Suhu:</strong>{' '}
              {medicalRecordDetail?.temperature ? medicalRecordDetail?.temperature + ' °C' : '-'}
            </Text>
            <Heading as="h4" size="md" color="brand.500" marginTop={4}>
              Hasil Pemeriksaan
            </Heading>
            <Text>
              <strong>Anamnesa:</strong> {medicalRecordDetail?.subjective || '-'}
            </Text>
            <Text>
              <strong>Pemeriksaan Fisik:</strong> {medicalRecordDetail?.objective || '-'}
            </Text>
            <Text>
              <strong>Diagnosis:</strong> {medicalRecordDetail?.assessment || '-'}
            </Text>
            <Text>
              <strong>Perencanaan:</strong> {medicalRecordDetail?.plan || '-'}
            </Text>
            <Text>
              <strong>Edukasi:</strong> {medicalRecordDetail?.education || '-'}
            </Text>
            <Box>
              <Text>
                <strong>Resep Obat:</strong> {!medicalRecordDetail?.prescriptions.length && '-'}
              </Text>
              {!!medicalRecordDetail?.prescriptions.length && (
                <UnorderedList marginTop={2}>
                  {medicalRecordDetail?.prescriptions.map((prescription, index) => (
                    <ListItem key={index}>
                      {prescription.medicine} @ {prescription.dosage} - {prescription.note}
                    </ListItem>
                  ))}
                </UnorderedList>
              )}
            </Box>
          </ModalBody>
          <ModalFooter borderTopWidth={2}>
            <Button
              type="button"
              colorScheme="brand"
              variant="outline"
              onClick={() => {
                onClose();
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

export default PatientMedicalRecords;
