'use client';

import { useContext } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';
import {
  Badge,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
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
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';

import { AuthContext } from '@/lib/contexts/auth';
import { scheduleSchema } from '@/lib/utils/schema';

import type { InferType } from 'yup';

const DoctorSchedules = () => {
  const { actor, user, refresh } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, isValid },
  } = useForm<InferType<typeof scheduleSchema>>({
    mode: 'onChange',
    defaultValues: {
      schedules: [
        {
          startTime: user?.schedules[0].startTime || '',
          endTime: user?.schedules[0].endTime || '',
          isActive: user?.schedules[0].isActive || false,
        },
        {
          startTime: user?.schedules[1].startTime || '',
          endTime: user?.schedules[1].endTime || '',
          isActive: user?.schedules[1].isActive || false,
        },
        {
          startTime: user?.schedules[2].startTime || '',
          endTime: user?.schedules[2].endTime || '',
          isActive: user?.schedules[2].isActive || false,
        },
        {
          startTime: user?.schedules[3].startTime || '',
          endTime: user?.schedules[3].endTime || '',
          isActive: user?.schedules[3].isActive || false,
        },
        {
          startTime: user?.schedules[4].startTime || '',
          endTime: user?.schedules[4].endTime || '',
          isActive: user?.schedules[4].isActive || false,
        },
        {
          startTime: user?.schedules[5].startTime || '',
          endTime: user?.schedules[5].endTime || '',
          isActive: user?.schedules[5].isActive || false,
        },
        {
          startTime: user?.schedules[6].startTime || '',
          endTime: user?.schedules[6].endTime || '',
          isActive: user?.schedules[6].isActive || false,
        },
      ],
    },
    resolver: yupResolver(scheduleSchema),
  });

  const schedules = useWatch({ control, name: 'schedules' });
  const toast = useToast();

  const onUpdateSchedule = async (payload: InferType<typeof scheduleSchema>) => {
    if (!actor) return;

    try {
      await actor.updateCallerSchedules(
        payload.schedules.map((schedule) => ({
          ...schedule,
          startTime: schedule.startTime || '',
          endTime: schedule.endTime || '',
        }))
      );
      await refresh();
      toast({
        title: 'Berhasil memperbarui jadwal praktek!',
        description: 'Jadwal praktek Anda telah diperbarui.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: 'Gagal memperbarui jadwal praktek!',
          description: err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

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
      <HStack justifyContent="space-between" width="full">
        <Heading as="h3" size="lg" color="brand.500" marginBottom={2}>
          Jadwal Praktek
        </Heading>
        <Button colorScheme="brand" leftIcon={<FaEdit />} onClick={onOpen}>
          Perbarui Jadwal
        </Button>
      </HStack>
      <TableContainer width="full">
        <Table variant="simple">
          <Thead backgroundColor="brand.50">
            <Tr>
              <Th>Hari</Th>
              <Th>Jam</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {user?.schedules.map((schedule, index) => (
              <Tr key={index}>
                <Td>{['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'][index]}</Td>
                <Td>
                  {schedule.startTime || ''} - {schedule.endTime || ''}
                </Td>
                <Td>
                  {schedule.isActive ? (
                    <Badge colorScheme="green">Aktif</Badge>
                  ) : (
                    <Badge colorScheme="red">Nonaktif</Badge>
                  )}
                </Td>
              </Tr>
            ))}
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
        <ModalContent as="form" onSubmit={handleSubmit(onUpdateSchedule)}>
          <ModalHeader borderBottomWidth={2}>Perbarui Jadwal Praktek</ModalHeader>
          <ModalBody display="flex" flexDirection="column" paddingY={4} gap={4}>
            <Checkbox
              fontWeight={schedules[0].isActive ? 700 : 400}
              {...register('schedules.0.isActive')}
            >
              Minggu
            </Checkbox>
            <HStack width="full">
              <FormControl
                isInvalid={!!errors?.schedules?.[0]?.startTime}
                isDisabled={!schedules[0].isActive}
                isRequired={schedules[0].isActive}
              >
                <FormLabel>Jam Mulai</FormLabel>
                <Input type="time" {...register('schedules.0.startTime')} />
                {errors?.schedules?.[0]?.startTime && (
                  <FormErrorMessage>{errors.schedules[0].startTime.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                isInvalid={!!errors?.schedules?.[0]?.endTime}
                isDisabled={!schedules[0].isActive}
                isRequired={schedules[0].isActive}
              >
                <FormLabel>Jam Selesai</FormLabel>
                <Input type="time" {...register('schedules.0.endTime')} />
                {errors?.schedules?.[0]?.endTime && (
                  <FormErrorMessage>{errors.schedules[0].endTime.message}</FormErrorMessage>
                )}
              </FormControl>
            </HStack>
            <Checkbox
              fontWeight={schedules[1].isActive ? 700 : 400}
              {...register('schedules.1.isActive')}
            >
              Senin
            </Checkbox>
            <HStack width="full">
              <FormControl
                isInvalid={!!errors?.schedules?.[1]?.startTime}
                isDisabled={!schedules[1].isActive}
                isRequired={schedules[1].isActive}
              >
                <FormLabel>Jam Mulai</FormLabel>
                <Input type="time" {...register('schedules.1.startTime')} />
                {errors?.schedules?.[1]?.startTime && (
                  <FormErrorMessage>{errors.schedules[1].startTime.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                isInvalid={!!errors?.schedules?.[1]?.endTime}
                isDisabled={!schedules[1].isActive}
                isRequired={schedules[1].isActive}
              >
                <FormLabel>Jam Selesai</FormLabel>
                <Input type="time" {...register('schedules.1.endTime')} />
                {errors?.schedules?.[1]?.endTime && (
                  <FormErrorMessage>{errors.schedules[1].endTime.message}</FormErrorMessage>
                )}
              </FormControl>
            </HStack>
            <Checkbox
              fontWeight={schedules[2].isActive ? 700 : 400}
              {...register('schedules.2.isActive')}
            >
              Selasa
            </Checkbox>
            <HStack width="full">
              <FormControl
                isInvalid={!!errors?.schedules?.[2]?.startTime}
                isDisabled={!schedules[2].isActive}
                isRequired={schedules[2].isActive}
              >
                <FormLabel>Jam Mulai</FormLabel>
                <Input type="time" {...register('schedules.2.startTime')} />
                {errors?.schedules?.[2]?.startTime && (
                  <FormErrorMessage>{errors.schedules[2].startTime.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                isInvalid={!!errors?.schedules?.[2]?.endTime}
                isDisabled={!schedules[2].isActive}
                isRequired={schedules[2].isActive}
              >
                <FormLabel>Jam Selesai</FormLabel>
                <Input type="time" {...register('schedules.2.endTime')} />
                {errors?.schedules?.[2]?.endTime && (
                  <FormErrorMessage>{errors.schedules[2].endTime.message}</FormErrorMessage>
                )}
              </FormControl>
            </HStack>
            <Checkbox
              fontWeight={schedules[3].isActive ? 700 : 400}
              {...register('schedules.3.isActive')}
            >
              Rabu
            </Checkbox>
            <HStack width="full">
              <FormControl
                isInvalid={!!errors?.schedules?.[3]?.startTime}
                isDisabled={!schedules[3].isActive}
                isRequired={schedules[3].isActive}
              >
                <FormLabel>Jam Mulai</FormLabel>
                <Input type="time" {...register('schedules.3.startTime')} />
                {errors?.schedules?.[3]?.startTime && (
                  <FormErrorMessage>{errors.schedules[3].startTime.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                isInvalid={!!errors?.schedules?.[3]?.endTime}
                isDisabled={!schedules[3].isActive}
                isRequired={schedules[3].isActive}
              >
                <FormLabel>Jam Selesai</FormLabel>
                <Input type="time" {...register('schedules.3.endTime')} />
                {errors?.schedules?.[3]?.endTime && (
                  <FormErrorMessage>{errors.schedules[3].endTime.message}</FormErrorMessage>
                )}
              </FormControl>
            </HStack>
            <Checkbox
              fontWeight={schedules[4].isActive ? 700 : 400}
              {...register('schedules.4.isActive')}
            >
              Kamis
            </Checkbox>
            <HStack width="full">
              <FormControl
                isInvalid={!!errors?.schedules?.[4]?.startTime}
                isDisabled={!schedules[4].isActive}
                isRequired={schedules[4].isActive}
              >
                <FormLabel>Jam Mulai</FormLabel>
                <Input type="time" {...register('schedules.4.startTime')} />
                {errors?.schedules?.[4]?.startTime && (
                  <FormErrorMessage>{errors.schedules[4].startTime.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                isInvalid={!!errors?.schedules?.[4]?.endTime}
                isDisabled={!schedules[4].isActive}
                isRequired={schedules[4].isActive}
              >
                <FormLabel>Jam Selesai</FormLabel>
                <Input type="time" {...register('schedules.4.endTime')} />
                {errors?.schedules?.[4]?.endTime && (
                  <FormErrorMessage>{errors.schedules[4].endTime.message}</FormErrorMessage>
                )}
              </FormControl>
            </HStack>
            <Checkbox
              fontWeight={schedules[5].isActive ? 700 : 400}
              {...register('schedules.5.isActive')}
            >
              Jum&apos;at
            </Checkbox>
            <HStack width="full">
              <FormControl
                isInvalid={!!errors?.schedules?.[5]?.startTime}
                isDisabled={!schedules[5].isActive}
                isRequired={schedules[5].isActive}
              >
                <FormLabel>Jam Mulai</FormLabel>
                <Input type="time" {...register('schedules.5.startTime')} />
                {errors?.schedules?.[5]?.startTime && (
                  <FormErrorMessage>{errors.schedules[5].startTime.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                isInvalid={!!errors?.schedules?.[5]?.endTime}
                isDisabled={!schedules[5].isActive}
                isRequired={schedules[5].isActive}
              >
                <FormLabel>Jam Selesai</FormLabel>
                <Input type="time" {...register('schedules.5.endTime')} />
                {errors?.schedules?.[5]?.endTime && (
                  <FormErrorMessage>{errors.schedules[5].endTime.message}</FormErrorMessage>
                )}
              </FormControl>
            </HStack>
            <Checkbox
              fontWeight={schedules[6].isActive ? 700 : 400}
              {...register('schedules.6.isActive')}
            >
              Sabtu
            </Checkbox>
            <HStack width="full">
              <FormControl
                isInvalid={!!errors?.schedules?.[6]?.startTime}
                isDisabled={!schedules[6].isActive}
                isRequired={schedules[6].isActive}
              >
                <FormLabel>Jam Mulai</FormLabel>
                <Input type="time" {...register('schedules.6.startTime')} />
                {errors?.schedules?.[6]?.startTime && (
                  <FormErrorMessage>{errors.schedules[6].startTime.message}</FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                isInvalid={!!errors?.schedules?.[6]?.endTime}
                isDisabled={!schedules[6].isActive}
                isRequired={schedules[6].isActive}
              >
                <FormLabel>Jam Selesai</FormLabel>
                <Input type="time" {...register('schedules.6.endTime')} />
                {errors?.schedules?.[6]?.endTime && (
                  <FormErrorMessage>{errors.schedules[6].endTime.message}</FormErrorMessage>
                )}
              </FormControl>
            </HStack>
          </ModalBody>
          <ModalFooter borderTopWidth={2}>
            <Button
              type="submit"
              colorScheme="brand"
              loadingText="Memperbarui"
              marginRight={2}
              isLoading={isSubmitting}
              isDisabled={!isDirty || !isValid}
            >
              Perbarui Jadwal
            </Button>
            <Button
              type="button"
              colorScheme="brand"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Batal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default DoctorSchedules;
