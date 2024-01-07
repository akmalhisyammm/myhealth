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

const USER_ROLES = ['admin', 'doctor', 'nurse', 'patient'];

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
  schedules: Opt(Vec(Record({ startTime: text, endTime: text, isActive: bool }))),
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
  hospitalId: text,
  patientId: Principal,
  doctorId: Principal,
  specialization: text,
  startTime: nat64,
  endTime: nat64,
  complaint: text,
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

const SchedulePayload = Record({
  schedules: Vec(Record({ startTime: text, endTime: text, isActive: bool })),
});

const AppointmentPayload = Record({
  hospitalId: text,
  doctorId: Principal,
  specialization: text,
  startTime: nat64,
  complaint: text,
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

// Helper function to check whether the user is an owner.
const isUserOwner = (id: Principal): bool => userStorage.get(id).Some.role === 'owner';

// Helper function to check whether the user is an owner and admin.
const isUserAdmin = (id: Principal): bool => userStorage.get(id).Some.role === 'admin';

// Helper function to check whether the user is a doctor.
const isUserDoctor = (id: Principal): bool => userStorage.get(id).Some.role === 'doctor';

// Helper function to check whether the user is a nurse.
const isUserNurse = (id: Principal): bool => userStorage.get(id).Some.role === 'nurse';

// Helper function to check whether the user is a patient.
const isUserPatient = (id: Principal): bool => userStorage.get(id).Some.role === 'patient';

// Helper function to check whether the user is verified.
const isUserVerified = (id: Principal): bool => userStorage.get(id).Some.isVerified;

// Helper function to check whether the doctor is available.
const isDoctorAvailable = (id: Principal, startTime: nat64): bool =>
  appointmentStorage
    .values()
    .filter((appointment: typeof Appointment) => appointment.doctorId === id)
    .every(
      (appointment: typeof Appointment) =>
        startTime < appointment.startTime - BigInt(1_800_000_000_000) ||
        startTime > appointment.endTime
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
    // Create owners and insert them into storage.
    const firstOwner = {
      id: Principal.fromText('ojdzb-hqznc-io47i-fr5j5-fj3y5-2ikeg-5c4ym-uayng-g7im2-pwfle-4qe'),
      hospitalId: None,
      role: 'owner',
      nik: None,
      nip: None,
      name: 'Muhammad Akmal Hisyam',
      specialization: None,
      schedules: None,
      email: 'muhammad.akmal@myhealth.id',
      phone: '081234567890',
      age: 22,
      gender: 'male',
      birthPlace: 'Tangerang',
      birthDate: BigInt(2_000_000_000_000_000_000n),
      bloodType: 'O',
      bloodRhesus: '+',
      religion: 'Islam',
      address: 'Jl. Isekai No. 70',
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
    const secondOwner = {
      id: Principal.fromText('kzwy6-dofh2-qqkqq-eli34-4qozm-o3l7z-3qefj-agytc-6doxm-6bnur-2qe'),
      hospitalId: None,
      role: 'owner',
      nik: None,
      nip: None,
      name: 'Rilo Anggoro Saputra',
      specialization: None,
      schedules: None,
      email: 'rilo.anggoro@myhealth.id',
      phone: '081234567890',
      age: 22,
      gender: 'male',
      birthPlace: 'Tangerang',
      birthDate: BigInt(2_000_000_000_000_000_000n),
      bloodType: 'O',
      bloodRhesus: '+',
      religion: 'Islam',
      address: 'Jl. Isekai No. 71',
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
    userStorage.insert(firstOwner.id, firstOwner);
    userStorage.insert(secondOwner.id, secondOwner);

    // Create hospitals and insert it into storage.
    const firstHospital = {
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
    const secondHospital = {
      id: uuidv4(),
      name: 'RSUD Cilegon',
      description: 'Rumah sakit umum daerah Cilegon',
      address: 'Jl. Jend. Sudirman No. 3',
      subDistrict: 'Kebon Nanas',
      district: 'Cilegon',
      city: 'Cilegon',
      province: 'Banten',
      postalCode: '15118',
      country: 'Indonesia',
      createdAt: ic.time(),
      updatedAt: ic.time(),
    };
    hospitalStorage.insert(firstHospital.id, secondHospital);
    hospitalStorage.insert(secondHospital.id, secondHospital);
  }),

  /* -------------------- HOSPITAL -------------------- */
  /**
   * Creates a new hospital by the owner.
   * @param payload - Payload for creating a new hospital.
   * @returns the created hospital or an error.
   */
  createHospital: update([HospitalPayload], Result(Hospital, Error), (payload) => {
    try {
      // If caller is not admin, return error.
      if (!isUserOwner(ic.caller())) {
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
   * Retrieves a hospital by ID.
   * @param id - The hospital ID.
   * @returns a hospital by ID or an error.
   */
  getHospital: query([text], Result(Hospital, Error), (id) => {
    try {
      // If hospital does not exist, return error.
      if (!hospitalStorage.containsKey(id)) {
        return Err({ NotFound: 'Rumah sakit tidak ditemukan' });
      }

      // Return the hospital by id.
      const hospital = hospitalStorage.get(id).Some;
      return Ok(hospital);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /* -------------------- USER -------------------- */
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
        schedules:
          payload.role === 'doctor'
            ? Some(Array(7).fill({ startTime: '', endTime: '', isActive: false }))
            : None,
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
      // Return the caller profile.
      const caller = userStorage.get(ic.caller()).Some;
      return Ok(caller);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves all users for the owner and admin.
   * @returns all users or an error.
   */
  getAllUsers: query([], Result(Vec(User), Error), () => {
    try {
      // If caller is not admin, return error.
      if (!isUserOwner(ic.caller()) && !isUserAdmin(ic.caller())) {
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
   * Retrieves an user by ID.
   * @param id - The user ID.
   * @returns an user by ID or an error.
   */
  getUser: query([Principal], Result(User, Error), (id) => {
    try {
      // If user does not exist, return error.
      if (!isUserExists(id)) {
        return Err({ NotFound: 'Pengguna tidak ditemukan' });
      }

      // Return the user by id.
      const user = userStorage.get(id).Some;
      return Ok(user);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves all doctor specializations by hospital ID for the patient.
   * @param hospitalId - The hospital ID.
   * @returns all doctor specializations by hospital ID or an error.
   */
  getSpecializationsByHospital: query([text], Result(Vec(text), Error), (hospitalId) => {
    try {
      // If caller is not patient, return error.
      if (!isUserPatient(ic.caller())) {
        return Err({
          Forbidden: 'Anda tidak memiliki akses untuk melihat semua spesialisasi dokter',
        });
      }

      // If hospital does not exist, return error.
      if (!hospitalStorage.containsKey(hospitalId)) {
        return Err({ NotFound: 'Rumah sakit tidak ditemukan' });
      }

      // Return all doctor specializations by hospital id.
      const specializations = userStorage
        .values()
        .filter(
          (user: typeof User) =>
            user.role === 'doctor' && user.hospitalId.Some === hospitalId && user.isVerified
        )
        .map((user: typeof User) => user.specialization.Some)
        .filter(
          (specialization: string, index: number, self: string[]) =>
            self.indexOf(specialization) === index
        );
      return Ok(specializations);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves all doctors by hospital ID and specialization for the patient.
   * @param hospitalId - The hospital ID.
   * @param specialization - The doctor specialization.
   * @returns all doctors by hospital ID and specialization or an error.
   */
  getDoctorsByHospitalAndSpecialization: query(
    [text, text],
    Result(Vec(User), Error),
    (hospitalId, specialization) => {
      try {
        // If caller does not exist, return error.
        if (!isUserExists(ic.caller())) {
          return Err({ NotFound: 'Anda belum terdaftar' });
        }

        // If caller is not patient, return error.
        if (!isUserPatient(ic.caller())) {
          return Err({
            Forbidden: 'Anda tidak memiliki akses untuk melihat semua dokter',
          });
        }

        // If hospital does not exist, return error.
        if (!hospitalStorage.containsKey(hospitalId)) {
          return Err({ NotFound: 'Rumah sakit tidak ditemukan' });
        }

        // Return all doctors by hospital id and specialization.
        const doctors = userStorage
          .values()
          .filter(
            (user: typeof User) =>
              user.role === 'doctor' &&
              user.hospitalId.Some === hospitalId &&
              user.specialization.Some === specialization &&
              user.isVerified
          );
        return Ok(doctors);
      } catch (error) {
        // If any error occurs, return it.
        return Err({ InternalError: 'Terjadi kesalahan' });
      }
    }
  ),

  /**
   * Retrieves the unverified users for the owner and admin.
   * @returns unverified users or an error.
   */
  getUnverifiedUsers: query([], Result(Vec(User), Error), () => {
    try {
      // If caller is not admin, return error.
      if (!isUserOwner(ic.caller()) && !isUserAdmin(ic.caller())) {
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
   * Updates the doctor schedules by the doctor.
   * @param schedules - The doctor schedules.
   * @returns the updated user or an error.
   */
  updateSchedules: update([SchedulePayload], Result(User, Error), (payload) => {
    try {
      // If caller is not doctor, return error.
      if (!isUserDoctor(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk mengubah jadwal praktek' });
      }

      // If schedules length is not 7, return error.
      if (payload.schedules.length !== 7) {
        return Err({ BadRequest: 'Jadwal praktek harus 7 hari' });
      }

      // Get the doctor from storage.
      const doctor = userStorage.get(ic.caller()).Some;

      // Update the doctor schedules and return it.
      const updatedDoctor = {
        ...doctor,
        schedules: Some(payload.schedules),
        updatedAt: ic.time(),
      };
      userStorage.insert(doctor.id, updatedDoctor);
      return Ok(updatedDoctor);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Reviews user registration by the owner and admin.
   * @param id - The user id.
   * @param isApproved - Whether the user is approved or not.
   * @returns the reviewed user or an error.
   */
  reviewUser: update([Principal, bool], Result(User, Error), (id, isApproved) => {
    try {
      // If caller is not admin, return error.
      if (!isUserOwner(ic.caller()) && !isUserAdmin(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk meninjau pengguna' });
      }

      // If user does not exist, return error.
      if (!isUserExists(id)) {
        return Err({ NotFound: 'Pengguna tidak ditemukan' });
      }

      // Get the user from storage.
      const user = userStorage.get(id).Some;

      // If caller is admin and user is admin, return error.
      if (isUserAdmin(ic.caller()) && user.role === 'admin') {
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

  /* -------------------- APPOINTMENT -------------------- */
  /**
   * Creates a new appointment with a doctor by the patient.
   * @param payload - Payload for creating a new appointment.
   * @returns the created appointment or an error.
   */
  createAppointment: update([AppointmentPayload], Result(Appointment, Error), (payload) => {
    try {
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
      if (payload.startTime <= ic.time()) {
        return Err({ BadRequest: 'Waktu yang dipilih harus setelah waktu saat ini' });
      }

      // If doctor is not available, return error.
      if (!isDoctorAvailable(payload.doctorId, payload.startTime)) {
        return Err({ BadRequest: 'Dokter tidak tersedia pada waktu yang dipilih' });
      }

      // Create new appointment, insert it into storage and return it.
      const newAppointment = {
        ...payload,
        id: uuidv4(),
        patientId: ic.caller(),
        endTime: payload.startTime + BigInt(1_800_000_000_000),
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
   * Retrieves all appointments for for the owner.
   * @returns all appointments or an error.
   */
  getAllAppointments: query([], Result(Vec(Appointment), Error), () => {
    try {
      // If caller is not admin, return error.
      if (!isUserOwner(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat semua janji temu' });
      }

      // Return all appointments.
      const appointments = appointmentStorage.values();
      return Ok(appointments);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves an appointment by ID.
   * @returns an appointment by ID or an error.
   */
  getAppointment: query([text], Result(Appointment, Error), (id) => {
    try {
      // If caller is not admin, return error.
      if (!isUserOwner(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat janji temu' });
      }

      // If appointment does not exist, return error.
      if (!isAppointmentExists(id)) {
        return Err({ NotFound: 'Janji temu tidak ditemukan' });
      }

      // Return the appointment by id.
      const appointment = appointmentStorage.get(id).Some;
      return Ok(appointment);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves the upcoming caller appointments for the patient and doctor.
   * @returns the upcoming caller appointments or an error.
   */
  getUpcomingCallerAppointments: query([], Result(Vec(Appointment), Error), () => {
    try {
      // If caller is not patient or doctor, return error.
      if (!isUserPatient(ic.caller()) && !isUserDoctor(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat janji temu' });
      }

      // Return the caller appointments filtered by caller id.
      const appointments = appointmentStorage
        .values()
        .filter((appointment: typeof Appointment) =>
          userStorage.get(ic.caller()).Some.role === 'patient'
            ? appointment.patientId.toText() === ic.caller().toText()
            : appointment.doctorId.toText() === ic.caller().toText() &&
              appointment.startTime > ic.time()
        );
      return Ok(appointments);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves the past caller appointments for the patient and doctor.
   * @returns the past caller appointments or an error.
   */
  getPastCallerAppointments: query([], Result(Vec(Appointment), Error), () => {
    try {
      // If caller is not patient or doctor, return error.
      if (!isUserPatient(ic.caller()) && !isUserDoctor(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat janji temu' });
      }

      // Return the caller appointments filtered by caller id.
      const appointments = appointmentStorage
        .values()
        .filter((appointment: typeof Appointment) =>
          userStorage.get(ic.caller()).Some.role === 'patient'
            ? appointment.patientId.toText() === ic.caller().toText()
            : appointment.doctorId.toText() === ic.caller().toText() &&
              appointment.startTime <= ic.time()
        );
      return Ok(appointments);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Retrieves the upcoming doctor appointments by doctor ID for the patient.
   * @param doctorId - The doctor ID.
   * @returns the upcoming doctor appointments by doctor ID or an error.
   */
  getUpcomingDoctorAppointments: query([Principal], Result(Vec(Appointment), Error), (doctorId) => {
    try {
      // If doctor does not exist, return error.
      if (!isUserExists(doctorId)) {
        return Err({ NotFound: 'Dokter tidak ditemukan' });
      }

      // If caller is not patient, return error.
      if (!isUserPatient(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat janji temu' });
      }

      // Return the upcoming doctor appointments by doctor ID.
      const appointments = appointmentStorage
        .values()
        .filter(
          (appointment: typeof Appointment) =>
            appointment.doctorId.toText() === doctorId.toText() &&
            appointment.startTime > ic.time() &&
            appointment.isApproved
        );
      return Ok(appointments);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan' });
    }
  }),

  /**
   * Deletes the appointment by the patient.
   * @param id - The appointment id.
   * @returns the deleted appointment or an error.
   */
  deleteAppointment: update([text], Result(Appointment, Error), (id) => {
    try {
      // If caller is not patient, return error.
      if (!isUserPatient(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk menghapus janji temu' });
      }

      // If appointment does not exist, return error.
      if (!isAppointmentExists(id)) {
        return Err({ NotFound: 'Janji temu tidak ditemukan' });
      }

      // Get the appointment from storage.
      const appointment = appointmentStorage.get(id).Some;

      // If caller is not the patient of the appointment, return error.
      if (appointment.patientId.toText() !== ic.caller().toText()) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk menghapus janji temu' });
      }

      // If appointment is already approved, return error.
      if (appointment.isApproved) {
        return Err({ BadRequest: 'Janji temu telah disetujui' });
      }

      // Delete the appointment and return it.
      appointmentStorage.remove(appointment.id);
      return Ok(appointment);
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
      if (appointment.doctorId.toText() !== ic.caller().toText()) {
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

  /* -------------------- MEDICAL RECORD -------------------- */
  /**
   * Creates a new patient medical record by the doctor.
   * @param payload - Payload for creating a new medical record.
   * @returns the created medical record or an error.
   */
  createMedicalRecord: update([MedicalRecordPayload], Result(MedicalRecord, Error), (payload) => {
    try {
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
      // If caller is not patient, return error.
      if (!isUserPatient(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat rekam medis' });
      }

      // Return the caller medical records.
      const medicalRecords = medicalRecordStorage
        .values()
        .filter(
          (medicalRecord: typeof MedicalRecord) =>
            medicalRecord.patientId.toText() === ic.caller().toText()
        );
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
