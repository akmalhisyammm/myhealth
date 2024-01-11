import * as yup from 'yup';

import {
  BLOOD_RHESUS_OPTIONS,
  BLOOD_TYPE_OPTIONS,
  GENDER_OPTIONS,
  RELIGION_OPTIONS,
  ROLE_OPTIONS,
  SPECIALIZATION_OPTIONS,
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
  hospitalId: yup.string().when('role', {
    is: (role: string) => role === 'admin' || role === 'doctor' || role === 'nurse',
    then: (schema) => schema.required('Rumah sakit wajib diisi'),
    otherwise: (schema) => schema,
  }),
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
    is: (role: string) => role === 'admin' || role === 'doctor' || role === 'nurse',
    then: (schema) =>
      schema
        .required('NIP wajib diisi')
        .matches(/^[0-9]+$/, 'NIP harus berupa angka')
        .min(18, 'NIP harus 18 digit')
        .max(18, 'NIP harus 18 digit'),
    otherwise: (schema) => schema,
  }),
  specialization: yup.string().when('role', {
    is: (role: string) => role === 'doctor',
    then: (schema) =>
      schema.required('Spesialisasi wajib diisi').oneOf(
        SPECIALIZATION_OPTIONS.map((option) => option.value),
        'Spesialisasi tidak valid'
      ),
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

/**
 * Schedule schema for validation form
 * @constant {yup.ObjectSchema} scheduleSchema
 */
export const scheduleSchema = yup.object().shape({
  schedules: yup
    .array()
    .of(
      yup.object().shape({
        startTime: yup.string().when('isActive', {
          is: (isActive: boolean) => isActive,
          then: (schema) =>
            schema
              .required('Jam mulai wajib diisi')
              .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Jam mulai tidak valid'),
          otherwise: (schema) => schema,
        }),
        endTime: yup.string().when('isActive', {
          is: (isActive: boolean) => isActive,
          then: (schema) =>
            schema
              .required('Jam selesai wajib diisi')
              .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Jam selesai tidak valid'),
          otherwise: (schema) => schema,
        }),
        isActive: yup.boolean().required('Status wajib diisi'),
      })
    )
    .required('Jadwal praktek wajib diisi'),
});

/**
 * Appointment schema for validation form
 * @constant {yup.ObjectSchema} appointmentSchema
 */
export const appointmentSchema = yup.object().shape({
  hospitalId: yup.string().required('Rumah sakit wajib diisi'),
  doctorId: yup.string().required('Dokter wajib diisi'),
  specialization: yup
    .string()
    .required('Spesialisasi wajib diisi')
    .oneOf(
      SPECIALIZATION_OPTIONS.map((option) => option.value),
      'Spesialisasi tidak valid'
    ),
  startTime: yup
    .date()
    .required('Tanggal dan waktu wajib diisi')
    .min(new Date(), 'Tanggal dan waktu harus setelah hari ini')
    .typeError('Tanggal dan waktu tidak valid'),
  complaint: yup.string().required('Keluhan wajib diisi'),
});

/**
 * Medical record doctor schema for validation form
 * @constant {yup.ObjectSchema} medicalRecordDoctorSchema
 */
export const medicalRecordDoctorSchema = yup.object().shape({
  subjective: yup.string().required('Subjektif wajib diisi'),
  objective: yup.string().required('Objektif wajib diisi'),
  assessment: yup.string().required('Penilaian wajib diisi'),
  plan: yup.string().required('Rencana wajib diisi'),
  education: yup.string().required('Edukasi pasien wajib diisi'),
  prescriptions: yup.array().of(
    yup.object().shape({
      medicine: yup.string().required('Obat wajib diisi'),
      dosage: yup.string().required('Dosis wajib diisi'),
      amount: yup.number().required('Jumlah wajib diisi').typeError('Jumlah harus berupa angka'),
      note: yup.string().required('Keterangan wajib diisi'),
    })
  ),
});

/**
 * Medical record nurse schema for validation form
 * @constant {yup.ObjectSchema} medicalRecordNurseSchema
 */
export const medicalRecordNurseSchema = yup.object().shape({
  height: yup
    .number()
    .required('Tinggi badan wajib diisi')
    .typeError('Tinggi badan harus berupa angka'),
  weight: yup
    .number()
    .required('Berat badan wajib diisi')
    .typeError('Berat badan harus berupa angka'),
  bloodPressure: yup
    .number()
    .required('Tekanan darah wajib diisi')
    .typeError('Tekanan darah harus berupa angka'),
  pulse: yup.number().required('Nadi wajib diisi').typeError('Nadi harus berupa angka'),
  temperature: yup.number().required('Suhu wajib diisi').typeError('Suhu harus berupa angka'),
  respiration: yup
    .number()
    .required('Pernapasan wajib diisi')
    .typeError('Pernapasan harus berupa angka'),
});
