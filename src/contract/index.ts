import {
  Canister,
  Err,
  Principal,
  Ok,
  Opt,
  Record,
  Result,
  StableBTreeMap,
  Variant,
  bool,
  ic,
  nat8,
  nat64,
  query,
  text,
  update,
  Some,
  None,
  init,
  Vec,
} from 'azle';
import { v4 as uuidv4 } from 'uuid';

const USER_ROLES = ['doctor', 'nurse', 'patient'];

const Hospital = Record({
  id: text,
  name: text,
  description: text,
  address: text,
  subDistrict: text,
  district: text,
  city: text,
  province: text,
  postalCode: text,
  country: text,
  createdAt: nat64,
  updatedAt: nat64,
});

const User = Record({
  id: Principal,
  hospitalId: Opt(text),
  role: text,
  nik: Opt(text),
  nip: Opt(text),
  name: text,
  specialization: Opt(text),
  schedules: Opt(Vec(Record({ day: text, startTime: text, endTime: text }))),
  email: text,
  phone: text,
  age: nat8,
  gender: text,
  birthPlace: text,
  birthDate: nat64,
  bloodType: text,
  bloodRhesus: text,
  religion: text,
  address: text,
  subDistrict: text,
  district: text,
  city: text,
  province: text,
  postalCode: text,
  country: text,
  isVerified: bool,
  createdAt: nat64,
  updatedAt: nat64,
});

const Appointment = Record({
  id: text,
  patientId: Principal,
  doctorId: Principal,
  dateTime: nat64,
  isApproved: bool,
  createdAt: nat64,
  updatedAt: nat64,
});

const MedicalRecord = Record({
  id: text,
  patientId: Principal,
  doctorId: Principal,
  appointmentId: text,
  diagnosis: text,
  prescription: text,
  createdAt: nat64,
  updatedAt: nat64,
});

const HospitalPayload = Record({
  name: text,
  description: text,
  address: text,
  subDistrict: text,
  district: text,
  city: text,
  province: text,
  postalCode: text,
  country: text,
});

const UserPayload = Record({
  hospitalId: text,
  role: text,
  nik: text,
  nip: text,
  name: text,
  specialization: text,
  email: text,
  phone: text,
  age: nat8,
  gender: text,
  birthPlace: text,
  birthDate: nat64,
  bloodType: text,
  bloodRhesus: text,
  religion: text,
  address: text,
  subDistrict: text,
  district: text,
  city: text,
  province: text,
  postalCode: text,
  country: text,
});

const AppointmentPayload = Record({
  doctorId: Principal,
  dateTime: nat64,
});

const MedicalRecordPayload = Record({
  patientId: Principal,
  appointmentId: text,
  diagnosis: text,
  prescription: text,
});

const Error = Variant({
  NotFound: text,
  Unauthorized: text,
  Forbidden: text,
  BadRequest: text,
  InternalError: text,
});
const hospitalStorage = StableBTreeMap(text, Hospital, 0);
const userStorage = StableBTreeMap(Principal, User, 1);
const appointmentStorage = StableBTreeMap(text, Appointment, 2);
const medicalRecordStorage = StableBTreeMap(text, MedicalRecord, 3);

// Helper function to check whether the user exists.
const isUserExists = (id: Principal): bool => userStorage.containsKey(id);

// Helper function to check whether the user is a doctor.
const isUserDoctor = (id: Principal): bool => userStorage.get(id).Some.role === 'doctor';

// Helper function to check whether the user is a nurse.
const isUserNurse = (id: Principal): bool => userStorage.get(id).Some.role === 'nurse';

// Helper function to check whether the user is a patient.
const isUserPatient = (id: Principal): bool => userStorage.get(id).Some.role === 'patient';

// Helper function to check whether the user is a admin.
const isUserAdmin = (id: Principal): bool => userStorage.get(id).Some.role === 'admin';

// Helper function to check whether the user is verified.
const isUserVerified = (id: Principal): bool => userStorage.get(id).Some.isVerified;

// Helper function to check whether the doctor is available.
const isDoctorAvailable = (id: Principal, dateTime: nat64): bool =>
  appointmentStorage
    .values()
    .filter((appointment: typeof Appointment) => appointment.doctorId === id)
    .every(
      (appointment: typeof Appointment) =>
        dateTime < appointment.dateTime - BigInt(900000) ||
        dateTime > appointment.dateTime + BigInt(900000)
    );

// Helper function to check whether the medical record exists.
const isMedicalRecordExists = (id: string): bool => medicalRecordStorage.containsKey(id);

// Helper function to check whether the appointment exists.
const isAppointmentExists = (id: string): bool => appointmentStorage.containsKey(id);

export default Canister({
  /**
   * Initializes the canister.
   */
  init: init([], () => {
    // Create admin user and insert it into storage.
    const admin = {
      id: Principal.fromText('ojdzb-hqznc-io47i-fr5j5-fj3y5-2ikeg-5c4ym-uayng-g7im2-pwfle-4qe'),
      hospitalId: None,
      role: 'admin',
      nik: None,
      nip: None,
      name: 'Admin',
      specialization: None,
      schedules: None,
      email: 'admin@myhealth.id',
      phone: '081234567890',
      age: 22,
      gender: 'male',
      birthPlace: 'Tangerang',
      birthDate: BigInt(2000000000000000),
      bloodType: 'O',
      bloodRhesus: '+',
      religion: 'Islam',
      address: 'Sari Bumi Indah Blok A1 No. 1',
      subDistrict: 'Binong',
      district: 'Curug',
      city: 'Tangerang',
      province: 'Banten',
      postalCode: '12345',
      country: 'Indonesia',
      isVerified: true,
      createdAt: ic.time(),
      updatedAt: ic.time(),
    };
    userStorage.insert(admin.id, admin);

    // Create hospital and insert it into storage.
    const hospital = {
      id: uuidv4(),
      name: 'RSUD Tangerang',
      description: 'Rumah sakit umum daerah Tangerang',
      address: 'Jl. Jend. Sudirman No. 2',
      subDistrict: 'Kebon Nanas',
      district: 'Tangerang',
      city: 'Tangerang',
      province: 'Banten',
      postalCode: '15118',
      country: 'Indonesia',
      createdAt: ic.time(),
      updatedAt: ic.time(),
    };
    hospitalStorage.insert(hospital.id, hospital);
  }),

  /**
   * Creates a new hospital by the admin.
   * @param payload - Payload for creating a new hospital.
   * @returns the created hospital or an error.
   */
  createHospital: update([HospitalPayload], Result(Hospital, Error), (payload) => {
    try {
      // If caller is not admin, return error.
      if (!isUserAdmin(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk mendaftarkan rumah sakit' });
      }

      // Create new hospital, insert it into storage and return it.
      const newHospital = { ...payload, id: uuidv4(), createdAt: ic.time(), updatedAt: ic.time() };
      hospitalStorage.insert(newHospital.id, newHospital);
      return Ok(newHospital);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves all hospitals.
   * @returns all hospitals or an error.
   */
  getAllHospitals: query([], Result(Vec(Hospital), Error), () => {
    try {
      // Return all hospitals.
      const hospitals = hospitalStorage.values();
      return Ok(hospitals);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Checks whether the caller is registered.
   * @returns true if the caller is registered, false otherwise.
   */
  isCallerRegistered: query([], bool, () => isUserExists(ic.caller())),

  /**
   * Creates a new user by the caller.
   * @param payload - Payload for creating a new user.
   * @returns the created user or an error.
   */
  createUser: update([UserPayload], Result(User, Error), (payload) => {
    try {
      // If caller already exists, return error.
      if (isUserExists(ic.caller())) {
        const user = userStorage.get(ic.caller()).Some;
        return Err({ BadRequest: `Anda telah terdaftar sebagai ${user.role}` });
      }

      // If role is not valid, return error.
      if (!USER_ROLES.includes(payload.role)) {
        return Err({ BadRequest: 'Peran tidak tersedia' });
      }

      // If role is patient, check whether the nik is already registered.
      if (payload.role === 'patient') {
        const isNikRegistered = userStorage
          .values()
          .some((user: typeof User) => user.nik === Some(payload.nik));
        if (isNikRegistered) {
          return Err({ BadRequest: 'NIK telah terdaftar' });
        }
      }

      // If role is doctor or nurse, check whether the nip is already registered.
      if (payload.role === 'doctor' || payload.role === 'nurse') {
        const isNipRegistered = userStorage
          .values()
          .some((user: typeof User) => user.nip === Some(payload.nip));
        if (isNipRegistered) {
          return Err({ BadRequest: 'NIP telah terdaftar' });
        }
      }

      // If birth date is greater than current time, return error.
      if (payload.birthDate > ic.time()) {
        return Err({ BadRequest: 'Tanggal lahir harus sebelum hari ini' });
      }

      // Create new user, insert it into storage and return it.
      const newUser = {
        ...payload,
        id: ic.caller(),
        hospitalId:
          payload.role === 'doctor' || payload.role === 'nurse' ? Some(payload.hospitalId) : None,
        nik: payload.role === 'patient' ? Some(payload.nik) : None,
        nip: payload.role === 'doctor' || payload.role === 'nurse' ? Some(payload.nip) : None,
        specialization: payload.role === 'doctor' ? Some(payload.specialization) : None,
        schedules: None,
        isVerified: false,
        createdAt: ic.time(),
        updatedAt: ic.time(),
      };
      userStorage.insert(newUser.id, newUser);
      return Ok(newUser);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves the caller profile.
   * @returns the caller profile or an error.
   */
  getCallerProfile: query([], Result(User, Error), () => {
    try {
      // If caller does not exist, return error.
      if (!isUserExists(ic.caller())) {
        return Err({ NotFound: 'Anda belum terdaftar' });
      }

      // Return the caller profile.
      const caller = userStorage.get(ic.caller()).Some;
      return Ok(caller);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves all users for the admin.
   * @returns all users or an error.
   */
  getAllUsers: query([], Result(Vec(User), Error), () => {
    try {
      // If caller is not admin, return error.
      if (!isUserAdmin(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat semua pengguna' });
      }

      // Return all users.
      const users = userStorage.values();
      return Ok(users);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves the unverified users for the admin.
   * @returns unverified users or an error.
   */
  getUnverifiedUsers: query([], Result(Vec(User), Error), () => {
    try {
      // If caller is not admin, return error.
      if (!isUserAdmin(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat daftar pengguna' });
      }

      // Return unverified users.
      const unverifiedUsers = userStorage.values().filter((user: typeof User) => !user.isVerified);
      return Ok(unverifiedUsers);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Reviews user registration by the admin.
   * @param id - The user id.
   * @param isApproved - Whether the user is approved or not.
   * @returns the reviewed user or an error.
   */
  reviewUser: update([Principal, bool], Result(User, Error), (id, isApproved) => {
    try {
      // If caller is not admin, return error.
      if (!isUserAdmin(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk meninjau pengguna' });
      }

      // If user does not exist, return error.
      if (!isUserExists(id)) {
        return Err({ NotFound: 'Pengguna tidak ditemukan' });
      }

      // Get the user from storage.
      const user = userStorage.get(id).Some;

      // If user is admin, return error.
      if (user.role === 'admin') {
        return Err({ BadRequest: 'Anda tidak dapat meninjau akun admin' });
      }

      // If user is verified, return error.
      if (user.isVerified) {
        return Err({ BadRequest: 'Anda tidak dapat meninjau akun yang telah terverifikasi' });
      }

      // If approved, verify the user and return it.
      if (isApproved) {
        const updatedUser = { ...user, isVerified: true, updatedAt: ic.time() };
        userStorage.insert(user.id, updatedUser);
        return Ok(updatedUser);
      }

      // If user is not approved, delete the user and return it.
      userStorage.remove(user.id);
      return Ok(user);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Creates a new appointment with a doctor by the patient.
   * @param payload - Payload for creating a new appointment.
   * @returns the created appointment or an error.
   */
  createAppointment: update([AppointmentPayload], Result(Appointment, Error), (payload) => {
    try {
      // If caller does not exist, return error.
      if (!isUserExists(ic.caller())) {
        return Err({ NotFound: 'Anda belum terdaftar' });
      }

      // If caller is not patient, return error.
      if (!isUserPatient(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk membuat janji temu' });
      }

      // If doctor does not exist, return error.
      if (!isUserExists(payload.doctorId)) {
        return Err({ NotFound: 'Dokter tidak ditemukan' });
      }

      // If doctor is not verified, return error.
      if (!isUserVerified(payload.doctorId)) {
        return Err({ BadRequest: 'Dokter belum terverifikasi' });
      }

      // If doctor is not doctor, return error.
      if (!isUserDoctor(payload.doctorId)) {
        return Err({ BadRequest: 'Dokter tidak tersedia' });
      }

      // If date time is less or equal than current time, return error.
      if (payload.dateTime <= ic.time()) {
        return Err({ BadRequest: 'Waktu yang dipilih harus setelah waktu saat ini' });
      }

      // If doctor is not available, return error.
      if (!isDoctorAvailable(payload.doctorId, payload.dateTime)) {
        return Err({ BadRequest: 'Dokter tidak tersedia pada waktu yang dipilih' });
      }

      // Create new appointment, insert it into storage and return it.
      const newAppointment = {
        ...payload,
        id: uuidv4(),
        patientId: ic.caller(),
        isApproved: false,
        createdAt: ic.time(),
        updatedAt: ic.time(),
      };
      appointmentStorage.insert(newAppointment.id, newAppointment);
      return Ok(newAppointment);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves the caller appointments.
   * @returns the caller appointments or an error.
   */
  getCallerAppointments: query([], Result(Vec(Appointment), Error), () => {
    try {
      // If caller does not exist, return error.
      if (!isUserExists(ic.caller())) {
        return Err({ NotFound: 'Anda belum terdaftar' });
      }

      // If caller is not patient or doctor, return error.
      if (!isUserPatient(ic.caller()) && !isUserDoctor(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat janji temu' });
      }

      // Return the caller appointments filtered by caller id and date time.
      const filteredAppointments = appointmentStorage
        .values()
        .filter((appointment: typeof Appointment) =>
          userStorage.get(ic.caller()).Some.role === 'patient'
            ? appointment.patientId === ic.caller() && appointment.dateTime > ic.time()
            : appointment.doctorId === ic.caller() && appointment.dateTime > ic.time()
        );
      return Ok(filteredAppointments);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Reviews the appointment by the doctor.
   * @param id - The appointment id.
   * @param isApproved - Whether the appointment is approved or not.
   * @returns the reviewed appointment or an error.
   */
  reviewAppointment: update([text, bool], Result(Appointment, Error), (id, isApproved) => {
    try {
      // If caller does not exist, return error.
      if (!isUserExists(ic.caller())) {
        return Err({ NotFound: 'Anda belum terdaftar' });
      }

      // If caller is not doctor, return error.
      if (!isUserDoctor(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk meninjau janji temu' });
      }

      // If appointment does not exist, return error.
      if (!isAppointmentExists(id)) {
        return Err({ NotFound: 'Janji temu tidak ditemukan' });
      }

      // Get the appointment from storage.
      const appointment = appointmentStorage.get(id).Some;

      // If caller is not the doctor of the appointment, return error.
      if (appointment.doctorId !== ic.caller()) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk meninjau janji temu' });
      }

      // If appointment is already approved, return error.
      if (appointment.isApproved) {
        return Err({ BadRequest: 'Janji temu telah disetujui' });
      }

      // If date time is less or equal than current time, return error.
      if (appointment.dateTime <= ic.time()) {
        return Err({ BadRequest: 'Waktu janji temu harus setelah waktu saat ini' });
      }

      // If approved, approve the appointment and return it.
      if (isApproved) {
        const updatedAppointment = { ...appointment, isApproved: true, updatedAt: ic.time() };
        appointmentStorage.insert(appointment.id, updatedAppointment);
        return Ok(updatedAppointment);
      }

      // If appointment is not approved, delete the appointment and return it.
      appointmentStorage.remove(appointment.id);
      return Ok(appointment);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Creates a new patient medical record by the doctor.
   * @param payload - Payload for creating a new medical record.
   * @returns the created medical record or an error.
   */
  createMedicalRecord: update([MedicalRecordPayload], Result(MedicalRecord, Error), (payload) => {
    try {
      // If caller does not exist, return error.
      if (!isUserExists(ic.caller())) {
        return Err({ NotFound: 'Anda belum terdaftar' });
      }

      // If caller is not doctor, return error.
      if (!isUserDoctor(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk membuat rekam medis' });
      }

      // If patient does not exist, return error.
      if (!isUserExists(payload.patientId)) {
        return Err({ NotFound: 'Pasien tidak ditemukan' });
      }

      // Create new medical record, insert it into storage and return it.
      const newMedicalRecord = {
        ...payload,
        id: uuidv4(),
        doctorId: ic.caller(),
        createdAt: ic.time(),
        updatedAt: ic.time(),
      };
      medicalRecordStorage.insert(newMedicalRecord.id, newMedicalRecord);
      return Ok(newMedicalRecord);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves the caller medical records.
   * @returns the caller medical records or an error.
   */
  getCallerMedicalRecords: query([], Result(Vec(MedicalRecord), Error), () => {
    try {
      // If caller does not exist, return error.
      if (!isUserExists(ic.caller())) {
        return Err({ NotFound: 'Anda belum terdaftar' });
      }

      // If caller is not patient, return error.
      if (!isUserPatient(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat rekam medis' });
      }

      // Return the caller medical records.
      const medicalRecords = medicalRecordStorage
        .values()
        .filter((medicalRecord: typeof MedicalRecord) => medicalRecord.patientId === ic.caller());
      return Ok(medicalRecords);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),
});

// A workaround to make uuid package work with Azle
// @ts-ignore
globalThis.crypto = {
  getRandomValues: () => {
    let array = new Uint8Array(32);

    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }

    return array;
  },
};

export type Hospital = typeof Hospital;
export type User = typeof User;
export type Appointment = typeof Appointment;
export type MedicalRecord = typeof MedicalRecord;
export type HospitalPayload = typeof HospitalPayload;
export type UserPayload = typeof UserPayload;
export type AppointmentPayload = typeof AppointmentPayload;
export type MedicalRecordPayload = typeof MedicalRecordPayload;
export type Error = typeof Error;
