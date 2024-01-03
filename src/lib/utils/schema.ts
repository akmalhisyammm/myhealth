import * as yup from 'yup';

import {
  BLOOD_RHESUS_OPTIONS,
  BLOOD_TYPE_OPTIONS,
  GENDER_OPTIONS,
  RELIGION_OPTIONS,
  ROLE_OPTIONS,
} from '@/lib/constants/options';

/**
 * Register schema for validation form
 * @constant {yup.ObjectSchema} registerSchema
 */
export const registerSchema = yup.object().shape({
  role: yup
    .string()
    .required('Peran wajib diisi')
    .oneOf(
      ROLE_OPTIONS.map((option) => option.value),
      'Peran tidak valid'
    ),
  nik: yup.string().when('role', {
    is: (role: string) => role === 'patient',
    then: (schema) =>
      schema
        .required('NIK wajib diisi')
        .matches(/^[0-9]+$/, 'NIK harus berupa angka')
        .min(16, 'NIK harus 16 digit')
        .max(16, 'NIK harus 16 digit'),
    otherwise: (schema) => schema,
  }),
  nip: yup.string().when('role', {
    is: (role: string) => role === 'doctor' || role === 'nurse',
    then: (schema) =>
      schema
        .required('NIP wajib diisi')
        .matches(/^[0-9]+$/, 'NIP harus berupa angka')
        .min(18, 'NIP harus 18 digit')
        .max(18, 'NIP harus 18 digit'),
    otherwise: (schema) => schema,
  }),
  name: yup.string().required('Nama wajib diisi'),
  gender: yup
    .string()
    .required('Jenis kelamin wajib diisi')
    .oneOf(
      GENDER_OPTIONS.map((option) => option.value),
      'Jenis kelamin tidak valid'
    ),
  specialization: yup.string().when('role', {
    is: (role: string) => role === 'doctor',
    then: (schema) => schema.required('Spesialisasi wajib diisi'),
    otherwise: (schema) => schema,
  }),
  email: yup
    .string()
    .required('Email wajib diisi')
    .email('Email tidak valid')
    .lowercase('Email harus huruf kecil'),
  phone: yup
    .string()
    .required('Nomor telepon wajib diisi')
    .matches(/^[0-9]+$/, 'Nomor telepon harus berupa angka')
    .min(10, 'Nomor telepon minimal 10 digit')
    .max(13, 'Nomor telepon maksimal 13 digit'),
  birthPlace: yup.string().required('Tempat lahir wajib diisi'),
  birthDate: yup
    .date()
    .required('Tanggal lahir wajib diisi')
    .max(new Date(), 'Tanggal lahir harus sebelum hari ini')
    .typeError('Tanggal lahir tidak valid'),
  bloodType: yup
    .string()
    .required('Golongan darah wajib diisi')
    .oneOf(
      BLOOD_TYPE_OPTIONS.map((option) => option.value),
      'Golongan darah tidak valid'
    ),
  bloodRhesus: yup
    .string()
    .required('Rhesus wajib diisi')
    .oneOf(
      BLOOD_RHESUS_OPTIONS.map((option) => option.value),
      'Rhesus tidak valid'
    ),
  religion: yup
    .string()
    .required('Agama wajib diisi')
    .oneOf(
      RELIGION_OPTIONS.map((option) => option.value),
      'Agama tidak valid'
    ),
  address: yup.string().required('Alamat wajib diisi'),
  subDistrict: yup.string().required('Kelurahan wajib diisi'),
  district: yup.string().required('Kecamatan wajib diisi'),
  city: yup.string().required('Kota wajib diisi'),
  province: yup.string().required('Provinsi wajib diisi'),
  postalCode: yup
    .string()
    .required('Kode pos wajib diisi')
    .matches(/^[0-9]+$/, 'Kode pos harus berupa angka')
    .min(5, 'Kode pos harus 5 digit')
    .max(5, 'Kode pos harus 5 digit'),
  country: yup.string().required('Negara wajib diisi'),
});
