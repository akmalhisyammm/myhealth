'use client';

import { useContext, useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import Select from 'react-select';

import {
  ROLE_OPTIONS,
  GENDER_OPTIONS,
  BLOOD_TYPE_OPTIONS,
  BLOOD_RHESUS_OPTIONS,
  RELIGION_OPTIONS,
  SPECIALIZATION_OPTIONS,
} from '@/lib/constants/options';
import { AuthContext } from '@/lib/contexts/auth';
import { dateToAge, dateToNat64 } from '@/lib/utils/date';
import { registerSchema } from '@/lib/utils/schema';

import type { Result } from 'azle';
import type { InferType } from 'yup';
import type { Error, Hospital } from '@/contract';

const RegisterForm = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  const { actor, isLoading, signUp } = useContext(AuthContext);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, isValid },
  } = useForm<InferType<typeof registerSchema>>({
    mode: 'onChange',
    defaultValues: {
      role: '',
      hospitalId: '',
      nik: '',
      nip: '',
      name: '',
      gender: '',
      specialization: '',
      email: '',
      phone: '',
      birthPlace: '',
      birthDate: new Date(''),
      bloodType: '',
      bloodRhesus: '',
      religion: '',
      address: '',
      subDistrict: '',
      district: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
    },
    resolver: yupResolver(registerSchema),
  });

  const role = useWatch({ control, name: 'role' });
  const toast = useToast();

  const onSignUp = async (payload: InferType<typeof registerSchema>) => {
    try {
      await signUp({
        ...payload,
        hospitalId: payload.hospitalId || '',
        nik: payload.nik || '',
        nip: payload.nip || '',
        specialization: payload.specialization || '',
        age: dateToAge(payload.birthDate),
        birthDate: dateToNat64(payload.birthDate),
      });
      toast({
        title: 'Berhasil mendaftar!',
        description: 'Anda diarahkan ke halaman utama.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      if (err instanceof Error) {
        return toast({
          title: 'Gagal mendaftar!',
          description: err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    if (!actor || (role !== 'admin' && role !== 'doctor' && role !== 'nurse'))
      return setHospitals([]);
    actor.getAllHospitals().then((res: Result<any, Error>) => setHospitals(res.Ok || []));
  }, [actor, role]);

  return (
    <VStack
      as="form"
      width="full"
      alignItems="start"
      backgroundColor="white"
      boxShadow="md"
      padding={6}
      borderWidth={1}
      borderRadius={8}
      spacing={4}
      onSubmit={handleSubmit(onSignUp)}
    >
      <FormControl isInvalid={!!errors.role} isRequired>
        <FormLabel>Peran</FormLabel>
        <Controller
          control={control}
          name="role"
          defaultValue=""
          render={({ field: { value, onChange, ...rest } }) => (
            <Select
              placeholder="Pilih peran"
              options={ROLE_OPTIONS}
              value={ROLE_OPTIONS.find((option) => option.value === value) || null}
              onChange={(option) => {
                reset({ role: option?.value || '' }, { keepDefaultValues: true });
                onChange(option?.value || '');
              }}
              {...rest}
            />
          )}
        />
        {errors.role ? (
          <FormErrorMessage>{errors.role.message}</FormErrorMessage>
        ) : (
          <FormHelperText>
            Pilih peran sesuai dengan diri Anda. Peran tidak dapat diubah setelah mendaftar.
          </FormHelperText>
        )}
      </FormControl>

      {!!role?.length && (
        <>
          {(role === 'admin' || role === 'doctor' || role === 'nurse') && (
            <FormControl
              isInvalid={!!errors.hospitalId}
              isRequired={role === 'doctor' || role === 'nurse'}
            >
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
          )}

          <Divider />

          <Heading as="h4" size="md">
            Data Diri
          </Heading>

          {(role === 'admin' || role === 'doctor' || role === 'nurse') && (
            <HStack
              alignItems="start"
              width="full"
              flexDirection={['column', 'column', 'row']}
              gap={4}
            >
              <FormControl
                isInvalid={!!errors.nip}
                isRequired={role === 'doctor' || role === 'nurse'}
              >
                <FormLabel>Nomor Induk Pegawai (NIP)</FormLabel>
                <Input type="text" {...register('nip')} />
                {errors.nip && <FormErrorMessage>{errors.nip.message}</FormErrorMessage>}
              </FormControl>

              {role === 'doctor' && (
                <FormControl isInvalid={!!errors.specialization} isRequired={role === 'doctor'}>
                  <FormLabel>Spesialisasi</FormLabel>
                  <Controller
                    control={control}
                    name="specialization"
                    defaultValue=""
                    render={({ field: { value, onChange, ...rest } }) => (
                      <Select
                        placeholder="Pilih spesialisasi"
                        options={SPECIALIZATION_OPTIONS}
                        value={
                          SPECIALIZATION_OPTIONS.find((option) => option.value === value) || null
                        }
                        onChange={(option) => onChange(option?.value || '')}
                        {...rest}
                      />
                    )}
                  />
                  {errors.specialization && (
                    <FormErrorMessage>{errors.specialization.message}</FormErrorMessage>
                  )}
                </FormControl>
              )}
            </HStack>
          )}

          {role === 'patient' && (
            <FormControl isInvalid={!!errors.nik} isRequired={role === 'patient'}>
              <FormLabel>Nomor Induk Kependudukan (NIK)</FormLabel>
              <Input type="text" {...register('nik')} />
              {errors.nik && <FormErrorMessage>{errors.nik.message}</FormErrorMessage>}
            </FormControl>
          )}

          <FormControl isInvalid={!!errors.name} isRequired>
            <FormLabel>Nama</FormLabel>
            <Input type="text" {...register('name')} />
            {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
          </FormControl>

          <HStack width="full" flexDirection={['column', 'column', 'row']} spacing={4}>
            <FormControl isInvalid={!!errors.gender} isRequired>
              <FormLabel>Jenis Kelamin</FormLabel>
              <Controller
                control={control}
                name="gender"
                defaultValue=""
                render={({ field: { value, onChange, ...rest } }) => (
                  <Select
                    placeholder="Pilih jenis kelamin"
                    options={GENDER_OPTIONS}
                    value={GENDER_OPTIONS.find((option) => option.value === value) || null}
                    onChange={(option) => onChange(option?.value || '')}
                    {...rest}
                  />
                )}
              />
              {errors.gender && <FormErrorMessage>{errors.gender.message}</FormErrorMessage>}
            </FormControl>
            <FormControl isInvalid={!!errors.bloodType} isRequired>
              <FormLabel>Golongan Darah</FormLabel>
              <Controller
                control={control}
                name="bloodType"
                defaultValue=""
                render={({ field: { value, onChange, ...rest } }) => (
                  <Select
                    placeholder="Pilih golongan darah"
                    options={BLOOD_TYPE_OPTIONS}
                    value={BLOOD_TYPE_OPTIONS.find((option) => option.value === value) || null}
                    onChange={(option) => onChange(option?.value || '')}
                    {...rest}
                  />
                )}
              />
              {errors.bloodType && <FormErrorMessage>{errors.bloodType.message}</FormErrorMessage>}
            </FormControl>
            <FormControl isInvalid={!!errors.bloodRhesus} isRequired>
              <FormLabel>Rhesus</FormLabel>
              <Controller
                control={control}
                name="bloodRhesus"
                defaultValue=""
                render={({ field: { value, onChange, ...rest } }) => (
                  <Select
                    placeholder="Pilih rhesus"
                    options={BLOOD_RHESUS_OPTIONS}
                    value={BLOOD_RHESUS_OPTIONS.find((option) => option.value === value) || null}
                    onChange={(option) => onChange(option?.value || '')}
                    {...rest}
                  />
                )}
              />
              {errors.bloodRhesus && (
                <FormErrorMessage>{errors.bloodRhesus.message}</FormErrorMessage>
              )}
            </FormControl>
          </HStack>

          <HStack width="full" flexDirection={['column', 'column', 'row']} spacing={4}>
            <FormControl isInvalid={!!errors.birthPlace} isRequired>
              <FormLabel>Tempat Lahir</FormLabel>
              <Input type="text" {...register('birthPlace')} />
              {errors.birthPlace && (
                <FormErrorMessage>{errors.birthPlace.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.birthDate} isRequired>
              <FormLabel>Tanggal Lahir</FormLabel>
              <Input
                type="date"
                max={new Date().toISOString().split('T')[0]}
                {...register('birthDate', { valueAsDate: true })}
              />
              {errors.birthDate && <FormErrorMessage>{errors.birthDate.message}</FormErrorMessage>}
            </FormControl>
            <FormControl isInvalid={!!errors.religion} isRequired>
              <FormLabel>Agama</FormLabel>
              <Controller
                control={control}
                name="religion"
                defaultValue=""
                render={({ field: { value, onChange, ...rest } }) => (
                  <Select
                    placeholder="Pilih agama"
                    options={RELIGION_OPTIONS}
                    value={RELIGION_OPTIONS.find((option) => option.value === value) || null}
                    onChange={(option) => onChange(option?.value || '')}
                    {...rest}
                  />
                )}
              />
              {errors.religion && <FormErrorMessage>{errors.religion.message}</FormErrorMessage>}
            </FormControl>
          </HStack>

          <Divider />

          <Heading as="h4" size="md">
            Alamat
          </Heading>

          <FormControl isInvalid={!!errors.address} isRequired>
            <FormLabel>Alamat</FormLabel>
            <Input type="text" {...register('address')} />
            {errors.address && <FormErrorMessage>{errors.address.message}</FormErrorMessage>}
          </FormControl>

          <HStack width="full" flexDirection={['column', 'column', 'row']} spacing={4}>
            <FormControl isInvalid={!!errors.subDistrict} isRequired>
              <FormLabel>Kelurahan</FormLabel>
              <Input type="text" {...register('subDistrict')} />
              {errors.subDistrict && (
                <FormErrorMessage>{errors.subDistrict.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.district} isRequired>
              <FormLabel>Kecamatan</FormLabel>
              <Input type="text" {...register('district')} />
              {errors.district && <FormErrorMessage>{errors.district.message}</FormErrorMessage>}
            </FormControl>
            <FormControl isInvalid={!!errors.city} isRequired>
              <FormLabel>Kota/Kabupaten</FormLabel>
              <Input type="text" {...register('city')} />
              {errors.city && <FormErrorMessage>{errors.city.message}</FormErrorMessage>}
            </FormControl>
          </HStack>

          <HStack width="full" flexDirection={['column', 'column', 'row']} spacing={4}>
            <FormControl isInvalid={!!errors.province} isRequired>
              <FormLabel>Provinsi</FormLabel>
              <Input type="text" {...register('province')} />
              {errors.province && <FormErrorMessage>{errors.province.message}</FormErrorMessage>}
            </FormControl>
            <FormControl isInvalid={!!errors.postalCode} isRequired>
              <FormLabel>Kode Pos</FormLabel>
              <Input type="text" {...register('postalCode')} />
              {errors.postalCode && (
                <FormErrorMessage>{errors.postalCode.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.country} isRequired>
              <FormLabel>Negara</FormLabel>
              <Input type="text" {...register('country')} />
              {errors.country && <FormErrorMessage>{errors.country.message}</FormErrorMessage>}
            </FormControl>
          </HStack>

          <Divider />

          <Heading as="h4" size="md">
            Kontak
          </Heading>

          <HStack width="full" flexDirection={['column', 'column', 'row']} spacing={4}>
            <FormControl isInvalid={!!errors.email} isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...register('email')} />
              {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
            </FormControl>
            <FormControl isInvalid={!!errors.phone} isRequired>
              <FormLabel>Nomor Telepon</FormLabel>
              <Input type="text" {...register('phone')} />
              {errors.phone && <FormErrorMessage>{errors.phone.message}</FormErrorMessage>}
            </FormControl>
          </HStack>

          <Button
            type="submit"
            colorScheme="brand"
            loadingText="Mendaftar"
            width="full"
            marginY={2}
            isLoading={isLoading || isSubmitting}
            isDisabled={!isDirty || !isValid}
          >
            Daftar
          </Button>
        </>
      )}
    </VStack>
  );
};

export default RegisterForm;
