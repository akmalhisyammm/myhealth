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
// import { v4 as uuidv4 } from 'uuid';

// const USER_ROLES = ['doctor', 'nurse', 'patient'];

const User = Record({
  id: Principal,
  nik: Opt(text),
  nip: Opt(text),
  name: text,
  role: text,
  specialization: Opt(text),
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
  date: nat64,
  createdAt: nat64,
  updatedAt: nat64,
});

const MedicalRecord = Record({
  id: text,
  patientId: Principal,
  doctorId: Principal,
  diagnosis: text,
  prescription: text,
  date: nat64,
  createdAt: nat64,
  updatedAt: nat64,
});

const UserPayload = Record({
  nik: text,
  nip: text,
  name: text,
  role: text,
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
  date: nat64,
});

const MedicalRecordPayload = Record({
  patientId: Principal,
  diagnosis: text,
  prescription: text,
  date: nat64,
});

const Error = Variant({
  NotFound: text,
  Unauthorized: text,
  Forbidden: text,
  BadRequest: text,
  InternalError: text,
});

const userStorage = StableBTreeMap(Principal, User, 0);
const appointmentStorage = StableBTreeMap(text, Appointment, 1);
const medicalRecordStorage = StableBTreeMap(text, MedicalRecord, 2);

// Helper function to check whether the user exists.
const isUserExists = (id: Principal): bool => userStorage.containsKey(id);

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
      nik: None,
      nip: None,
      name: 'Admin',
      role: 'admin',
      specialization: None,
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
  }),

  /**
   * Checks whether the caller is registered.
   * @returns true if the caller is registered, false otherwise.
   */
  isCallerRegistered: query([], bool, () => isUserExists(ic.caller())),

  /**
   * Creates a new user.
   * @param payload - Payload for creating a new user.
   * @returns the created user or an error.
   */
  createUser: update([UserPayload], Result(User, Error), (payload) => {
    try {
      // If user already exists, return error.
      if (isUserExists(ic.caller())) {
        const user = userStorage.get(ic.caller()).Some;
        return Err({ BadRequest: `Anda telah terdaftar sebagai ${user.role}` });
      }

      // Create new user, insert it into storage and return it.
      const { nik, nip, specialization, ...rest } = payload;
      const newUser = {
        id: ic.caller(),
        nik: payload.role === 'patient' ? Some(nik) : None,
        nip: payload.role === 'doctor' || payload.role === 'nurse' ? Some(nip) : None,
        specialization: payload.role === 'doctor' ? Some(specialization) : None,
        isVerified: false,
        createdAt: ic.time(),
        updatedAt: ic.time(),
        ...rest,
      };
      userStorage.insert(newUser.id, newUser);
      return Ok(newUser);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves the user profile.
   * @returns the user profile or an error.
   */
  getMyProfile: query([], Result(User, Error), () => {
    try {
      // If user does not exist, return error.
      if (!isUserExists(ic.caller())) {
        return Err({ NotFound: 'Anda belum terdaftar' });
      }

      // Return the user profile.
      const user = userStorage.get(ic.caller()).Some;
      return Ok(user);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves all users.
   * @returns all users or an error.
   */
  getAllUsers: query([], Result(Vec(User), Error), () => {
    try {
      // If user is not admin, return error.
      if (userStorage.get(ic.caller()).Some.role !== 'admin') {
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
   * Verifies the user.
   * @param id - The user id.
   * @returns the verified user or an error.
   */
  verifyUser: update([Principal], Result(User, Error), (id) => {
    try {
      // If user is not admin, return error.
      if (userStorage.get(ic.caller()).Some.role !== 'admin') {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk memverifikasi pengguna' });
      }

      // If user does not exist, return error.
      if (!isUserExists(id)) {
        return Err({ NotFound: 'Pengguna tidak ditemukan' });
      }

      // Verify the user and return it.
      const user = userStorage.get(id).Some;

      // If user is verified, return error.
      if (user.isVerified) {
        return Err({ BadRequest: 'Pengguna telah terverifikasi' });
      }

      // Update the user, insert it into storage and return it.
      const updatedUser = { ...user, isVerified: true, updatedAt: ic.time() };
      userStorage.insert(user.id, updatedUser);
      return Ok(updatedUser);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Removes the user.
   * @param id - The user id.
   * @returns the removed user or an error.
   */
  deleteUser: update([Principal], Result(User, Error), (id) => {
    try {
      // If user is not admin, return error.
      if (userStorage.get(ic.caller()).Some.role !== 'admin') {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk menghapus pengguna' });
      }

      // If user does not exist, return error.
      if (!isUserExists(id)) {
        return Err({ NotFound: 'Pengguna tidak ditemukan' });
      }

      // Get the user from storage.
      const user = userStorage.get(id).Some;

      // If user is admin, return error.
      if (user.role === 'admin') {
        return Err({ BadRequest: 'Anda tidak dapat menghapus akun admin' });
      }

      // If user is verified, return error.
      if (user.isVerified) {
        return Err({ BadRequest: 'Anda tidak dapat menghapus akun yang telah terverifikasi' });
      }

      // Delete the user and return it.
      userStorage.remove(user.id);
      return Ok(user);
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

export type User = typeof User;
export type Appointment = typeof Appointment;
export type MedicalRecord = typeof MedicalRecord;
export type UserPayload = typeof UserPayload;
export type AppointmentPayload = typeof AppointmentPayload;
export type MedicalRecordPayload = typeof MedicalRecordPayload;
export type Error = typeof Error;
