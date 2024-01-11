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
  nat32,
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

// Define user roles.
const USER_ROLES = ['owner', 'admin', 'doctor', 'nurse', 'patient'];

// Initialize records.
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

const HospitalRequest = Record({
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

const HospitalResponse = Record({
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
  age: nat32,
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

const UserRequest = Record({
  hospitalId: text,
  role: text,
  nik: text,
  nip: text,
  name: text,
  specialization: text,
  email: text,
  phone: text,
  age: nat32,
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

const UserResponse = Record({
  id: Principal,
  hospital: HospitalResponse,
  role: text,
  nik: text,
  nip: text,
  name: text,
  specialization: text,
  schedules: Vec(Record({ startTime: text, endTime: text, isActive: bool })),
  email: text,
  phone: text,
  age: nat32,
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
  isConfirmed: bool,
  createdAt: nat64,
  updatedAt: nat64,
});

const AppointmentRequest = Record({
  hospitalId: text,
  doctorId: Principal,
  specialization: text,
  startTime: nat64,
  complaint: text,
});

const AppointmentResponse = Record({
  id: text,
  hospital: HospitalResponse,
  patient: UserResponse,
  doctor: UserResponse,
  specialization: text,
  startTime: nat64,
  endTime: nat64,
  complaint: text,
  isConfirmed: bool,
  createdAt: nat64,
  updatedAt: nat64,
});

const MedicalRecord = Record({
  id: text,
  patientId: Principal,
  doctorId: Principal,
  appointmentId: text,
  hospitalId: text,
  height: Opt(nat32),
  weight: Opt(nat32),
  bloodPressure: Opt(nat32),
  pulse: Opt(nat32),
  temperature: Opt(nat32),
  respiration: Opt(nat32),
  subjective: Opt(text),
  objective: Opt(text),
  assessment: Opt(text),
  plan: Opt(text),
  education: Opt(text),
  prescriptions: Opt(Vec(Record({ medicine: text, dosage: text, amount: nat32, note: text }))),
  createdAt: nat64,
  updatedAt: nat64,
});

const MedicalRecordRequest = Record({
  height: nat32,
  weight: nat32,
  bloodPressure: nat32,
  pulse: nat32,
  temperature: nat32,
  respiration: nat32,
  subjective: text,
  objective: text,
  assessment: text,
  plan: text,
  education: text,
  prescriptions: Vec(Record({ medicine: text, dosage: text, amount: nat32, note: text })),
});

const MedicalRecordResponse = Record({
  id: text,
  patient: UserResponse,
  doctor: UserResponse,
  appointment: AppointmentResponse,
  hospital: HospitalResponse,
  height: nat32,
  weight: nat32,
  bloodPressure: nat32,
  pulse: nat32,
  temperature: nat32,
  respiration: nat32,
  subjective: text,
  objective: text,
  assessment: text,
  plan: text,
  education: text,
  prescriptions: Vec(Record({ medicine: text, dosage: text, amount: nat32, note: text })),
  createdAt: nat64,
  updatedAt: nat64,
});

// Initialize variants.
const Error = Variant({
  NotFound: text,
  Unauthorized: text,
  Forbidden: text,
  BadRequest: text,
  InternalError: text,
});

// Initialize storages.
const hospitalStorage = StableBTreeMap(text, Hospital, 0);
const userStorage = StableBTreeMap(Principal, User, 1);
const appointmentStorage = StableBTreeMap(text, Appointment, 2);
const medicalRecordStorage = StableBTreeMap(text, MedicalRecord, 3);

/**
 * Checks whether the hospital exists.
 * @param id - The hospital ID.
 * @returns true if the hospital exists, false otherwise.
 */
const isHospitalExists = (id: string): bool => hospitalStorage.containsKey(id);

/**
 * Checks whether the user exists.
 * @param id - The user ID.
 * @returns true if the user exists, false otherwise.
 */
const isUserExists = (id: Principal): bool => userStorage.containsKey(id);

/**
 * Checks whether the medical record exists.
 * @param id - The medical record ID.
 * @returns true if the medical record exists, false otherwise.
 */
const isMedicalRecordExists = (id: string): bool => medicalRecordStorage.containsKey(id);

/**
 * Checks whether the appointment exists.
 * @param id - The appointment ID.
 * @returns true if the appointment exists, false otherwise.
 */
const isAppointmentExists = (id: string): bool => appointmentStorage.containsKey(id);

/**
 * Checks whether the user is an owner.
 * @param id - The user ID.
 * @returns true if the user is an owner, false otherwise.
 */
const isUserOwner = (id: Principal): bool => userStorage.get(id).Some.role === 'owner';

/**
 * Checks whether the user is an admin.
 * @param id - The user ID.
 * @returns true if the user is an admin, false otherwise.
 */
const isUserAdmin = (id: Principal): bool => userStorage.get(id).Some.role === 'admin';

/**
 * Checks whether the user is a doctor.
 * @param id - The user ID.
 * @returns true if the user is a doctor, false otherwise.
 */
const isUserDoctor = (id: Principal): bool => userStorage.get(id).Some.role === 'doctor';

/**
 * Checks whether the user is a nurse.
 * @param id - The user ID.
 * @returns true if the user is a nurse, false otherwise.
 */
const isUserNurse = (id: Principal): bool => userStorage.get(id).Some.role === 'nurse';

/**
 * Checks whether the user is a patient.
 * @param id - The user ID.
 * @returns true if the user is a patient, false otherwise.
 */
const isUserPatient = (id: Principal): bool => userStorage.get(id).Some.role === 'patient';

/**
 * Checks whether the user is verified.
 * @param id - The user ID.
 * @returns true if the user is verified, false otherwise.
 */
const isUserVerified = (id: Principal): bool => userStorage.get(id).Some.isVerified;

/**
 * Checks whether the doctor is available.
 * @param id - The doctor ID.
 * @param startTime - The start time.
 */
const isDoctorAvailable = (id: Principal, startTime: nat64): bool =>
  appointmentStorage
    .values()
    .filter((appointment: typeof Appointment) => appointment.doctorId === id)
    .every(
      (appointment: typeof Appointment) =>
        startTime < appointment.startTime - BigInt(1_800_000_000_000) ||
        startTime > appointment.endTime
    );

/**
 * Checks whether the appointment is finished.
 * @param id - The appointment ID.
 * @returns true if the appointment is finished, false otherwise.
 */
const isAppointmentFinished = (id: string): bool =>
  appointmentStorage.get(id).Some.startTime <= ic.time();

/**
 * Generates hospital response.
 * @param id - The hospital ID.
 * @returns the hospital response.
 */
const generateHospitalResponse = (id: text): typeof HospitalResponse => {
  // If hospital does not exist, return default hospital response.
  if (!isHospitalExists(id)) {
    return {
      id: '',
      name: '',
      description: '',
      address: '',
      subDistrict: '',
      district: '',
      city: '',
      province: '',
      postalCode: '',
      country: '',
      createdAt: 0n,
      updatedAt: 0n,
    };
  }

  // Return the hospital response by id.
  const hospital = hospitalStorage.get(id).Some;
  return hospital;
};

/**
 * Generates user response.
 * @param id - The user ID.
 * @returns the user response.
 */
const generateUserResponse = (id: Principal): typeof UserResponse => {
  // If user does not exist, return default user response.
  if (!isUserExists(id)) {
    return {
      id: Principal.fromText('aaaaa-aa'),
      hospital: generateHospitalResponse(''),
      role: '',
      nik: '',
      nip: '',
      name: '',
      specialization: '',
      schedules: [],
      email: '',
      phone: '',
      age: 0,
      gender: '',
      birthPlace: '',
      birthDate: 0n,
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
      isVerified: false,
      createdAt: 0n,
      updatedAt: 0n,
    };
  }

  // Return the user response by id.
  const user = userStorage.get(id).Some;
  return {
    ...user,
    hospital: generateHospitalResponse(user?.hospitalId.Some || ''),
    nik: user?.nik.Some || '',
    nip: user?.nip.Some || '',
    specialization: user?.specialization.Some || '',
    schedules: user?.schedules.Some || [],
  };
};

/**
 * Generates appointment response.
 * @param id - The appointment ID.
 * @returns the appointment response.
 */
const generateAppointmentResponse = (id: text): typeof AppointmentResponse => {
  // If appointment does not exist, return default appointment response.
  if (!isAppointmentExists(id)) {
    return {
      id: '',
      hospital: generateHospitalResponse(''),
      patient: generateUserResponse(Principal.fromText('aaaaa-aa')),
      doctor: generateUserResponse(Principal.fromText('aaaaa-aa')),
      specialization: '',
      startTime: 0n,
      endTime: 0n,
      complaint: '',
      isConfirmed: false,
      createdAt: 0n,
      updatedAt: 0n,
    };
  }

  // Return the appointment response by id.
  const appointment = appointmentStorage.get(id).Some;
  return {
    ...appointment,
    hospital: generateHospitalResponse(appointment?.hospitalId || ''),
    patient: generateUserResponse(appointment?.patientId || Principal.fromText('aaaaa-aa')),
    doctor: generateUserResponse(appointment?.doctorId || Principal.fromText('aaaaa-aa')),
  };
};

/**
 * Generates medical record response.
 * @param id - The medical record ID.
 * @returns the medical record response.
 */
const generateMedicalRecordResponse = (id: text): typeof MedicalRecordResponse => {
  // If medical record does not exist, return default medical record response.
  if (!isMedicalRecordExists(id)) {
    return {
      id: '',
      patient: generateUserResponse(Principal.fromText('aaaaa-aa')),
      doctor: generateUserResponse(Principal.fromText('aaaaa-aa')),
      appointment: generateAppointmentResponse(''),
      hospital: generateHospitalResponse(''),
      height: 0,
      weight: 0,
      bloodPressure: 0,
      pulse: 0,
      temperature: 0,
      respiration: 0,
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      education: '',
      prescriptions: [],
      createdAt: 0n,
      updatedAt: 0n,
    };
  }

  // Return the medical record response by id.
  const medicalRecord = medicalRecordStorage.get(id).Some;
  return {
    ...medicalRecord,
    patient: generateUserResponse(medicalRecord?.patientId || Principal.fromText('aaaaa-aa')),
    doctor: generateUserResponse(medicalRecord?.doctorId || Principal.fromText('aaaaa-aa')),
    appointment: generateAppointmentResponse(medicalRecord?.appointmentId || ''),
    hospital: generateHospitalResponse(medicalRecord?.hospitalId || ''),
    height: medicalRecord?.height.Some || 0,
    weight: medicalRecord?.weight.Some || 0,
    bloodPressure: medicalRecord?.bloodPressure.Some || 0,
    pulse: medicalRecord?.pulse.Some || 0,
    temperature: medicalRecord?.temperature.Some || 0,
    respiration: medicalRecord?.respiration.Some || 0,
    subjective: medicalRecord?.subjective.Some || '',
    objective: medicalRecord?.objective.Some || '',
    assessment: medicalRecord?.assessment.Some || '',
    plan: medicalRecord?.plan.Some || '',
    education: medicalRecord?.education.Some || '',
    prescriptions: medicalRecord?.prescriptions.Some || [],
  };
};

// Export the canister.
export default Canister({
  /**
   * Initializes the canister.
   * @returns void.
   */
  init: init([], () => {
    // Create initial hospitals and insert it into storage.
    const initHospitals = [
      {
        id: uuidv4(),
        name: 'RS Cipto Mangunkusumo (RSCM)',
        description: 'Rumah sakit umum pusat Cipto Mangunkusumo Jakarta',
        address: 'Jl. Diponegoro No. 71, RW. 2',
        subDistrict: 'Kenari',
        district: 'Senen',
        city: 'Jakarta Pusat',
        province: 'DKI Jakarta',
        postalCode: '10430',
        country: 'Indonesia',
        createdAt: ic.time(),
        updatedAt: ic.time(),
      },
      {
        id: uuidv4(),
        name: 'RS Premier Bintaro',
        description: 'Rumah sakit Premier Bintaro Jakarta',
        address: 'Jl. M.H. Thamrin No. 1, RT.1/RW.3',
        subDistrict: 'Pondok Jaya',
        district: 'Pondok Aren',
        city: 'Tangerang Selatan',
        province: 'Banten',
        postalCode: '15224',
        country: 'Indonesia',
        createdAt: ic.time(),
        updatedAt: ic.time(),
      },
      {
        id: uuidv4(),
        name: 'RS Mayapada',
        description: 'Rumah sakit Mayapada Jakarta',
        address: 'Jl. Lebak Bulus I No. 29, RT.1/RW.2',
        subDistrict: 'Lebak Bulus',
        district: 'Cilandak Barat',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postalCode: '12440',
        country: 'Indonesia',
        createdAt: ic.time(),
        updatedAt: ic.time(),
      },
      {
        id: uuidv4(),
        name: 'RS Pertamina Jaya',
        description: 'Rumah sakit Pertamina Jaya Jakarta',
        address: 'Jl. Kyai Maja No. 2, RT.1/RW.2',
        subDistrict: 'Kebayoran Baru',
        district: 'Kebayoran Baru',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postalCode: '12120',
        country: 'Indonesia',
        createdAt: ic.time(),
        updatedAt: ic.time(),
      },
      {
        id: uuidv4(),
        name: 'RSUP Fatmawati',
        description: 'Rumah sakit umum pusat Fatmawati Jakarta',
        address: 'Jl. RS Fatmawati No. 1, RT.1/RW.1',
        subDistrict: 'Cilandak Timur',
        district: 'Cilandak',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postalCode: '12430',
        country: 'Indonesia',
        createdAt: ic.time(),
        updatedAt: ic.time(),
      },
    ];
    initHospitals.forEach((hospital) => hospitalStorage.insert(hospital.id, hospital));

    // Create initial owners and insert them into storage.
    const initOwners = [
      {
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
      },
      {
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
      },
    ];
    initOwners.forEach((owner) => userStorage.insert(owner.id, owner));
  }),

  /* -------------------- HOSPITAL -------------------- */
  /**
   * Creates a new hospital by the owner.
   * @param req - Request for creating a new hospital.
   * @returns the created hospital or an error.
   */
  createHospital: update([HospitalRequest], Result(Hospital, Error), (req) => {
    try {
      // If caller is not owner, return error.
      if (!isUserOwner(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk mendaftarkan rumah sakit.' });
      }

      // Create new hospital, insert it into storage and return it.
      const newHospital = { ...req, id: uuidv4(), createdAt: ic.time(), updatedAt: ic.time() };
      hospitalStorage.insert(newHospital.id, newHospital);
      return Ok(newHospital);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves all hospitals.
   * @returns all hospitals or an error.
   */
  getAllHospitals: query([], Result(Vec(HospitalResponse), Error), () => {
    try {
      // Return all hospitals.
      const hospitals = hospitalStorage
        .values()
        .map((hospital: typeof Hospital) => generateHospitalResponse(hospital.id));
      return Ok(hospitals);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves a hospital by ID.
   * @param id - The hospital ID.
   * @returns a hospital or an error.
   */
  getHospital: query([text], Result(HospitalResponse, Error), (id) => {
    try {
      // If hospital does not exist, return error.
      if (!hospitalStorage.containsKey(id)) {
        return Err({ NotFound: 'Rumah sakit tidak ditemukan.' });
      }

      // Return the hospital by id.
      const hospital = hospitalStorage.get(id).Some;
      return Ok(generateHospitalResponse(hospital.id));
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Updates a hospital by ID by the owner.
   * @param id - The hospital ID.
   * @param req - Request for updating a hospital.
   * @returns the updated hospital or an error.
   */
  updateHospital: update([text, HospitalRequest], Result(HospitalResponse, Error), (id, req) => {
    try {
      // If caller is not owner, return error.
      if (!isUserOwner(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk mengubah rumah sakit.' });
      }

      // If hospital does not exist, return error.
      if (!hospitalStorage.containsKey(id)) {
        return Err({ NotFound: 'Rumah sakit tidak ditemukan.' });
      }

      // Get the hospital from storage.
      const hospital = hospitalStorage.get(id).Some;

      // Update the hospital and return it.
      const updatedHospital = { ...hospital, ...req, updatedAt: ic.time() };
      hospitalStorage.insert(hospital.id, updatedHospital);
      return Ok(generateHospitalResponse(updatedHospital.id));
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
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
   * @param req - Request for creating a new user.
   * @returns the created user or an error.
   */
  createUser: update([UserRequest], Result(UserResponse, Error), (req) => {
    try {
      // If caller already exists, return error.
      if (isUserExists(ic.caller())) {
        const user = userStorage.get(ic.caller()).Some;
        return Err({ BadRequest: `Anda telah terdaftar sebagai ${user.role}.` });
      }

      // If role is not valid, return error.
      if (!USER_ROLES.includes(req.role)) {
        return Err({ BadRequest: 'Peran tidak tersedia.' });
      }

      // If role is patient, check whether the nik is already registered.
      if (req.role === 'patient') {
        const isNikRegistered = userStorage
          .values()
          .some((user: typeof User) => user.nik === Some(req.nik));
        if (isNikRegistered) {
          return Err({ BadRequest: 'NIK telah terdaftar.' });
        }
      }

      // If role is doctor or nurse, check whether the nip is already registered.
      if (req.role === 'doctor' || req.role === 'nurse') {
        const isNipRegistered = userStorage
          .values()
          .some((user: typeof User) => user.nip === Some(req.nip));
        if (isNipRegistered) {
          return Err({ BadRequest: 'NIP telah terdaftar.' });
        }
      }

      // If birth date is greater than current time, return error.
      if (req.birthDate > ic.time()) {
        return Err({ BadRequest: 'Tanggal lahir harus sebelum hari ini.' });
      }

      // Create new user, insert it into storage and return it.
      const newUser = {
        ...req,
        id: ic.caller(),
        hospitalId:
          req.role === 'admin' || req.role === 'doctor' || req.role === 'nurse'
            ? Some(req.hospitalId)
            : None,
        nik: req.role === 'patient' ? Some(req.nik) : None,
        nip:
          req.role === 'admin' || req.role === 'doctor' || req.role === 'nurse'
            ? Some(req.nip)
            : None,
        specialization: req.role === 'doctor' ? Some(req.specialization) : None,
        schedules:
          req.role === 'doctor'
            ? Some(Array(7).fill({ startTime: '', endTime: '', isActive: false }))
            : None,
        isVerified: false,
        createdAt: ic.time(),
        updatedAt: ic.time(),
      };
      userStorage.insert(newUser.id, newUser);
      return Ok(generateUserResponse(newUser.id));
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves all users for the owner.
   * @returns all users or an error.
   */
  getAllUsers: query([], Result(Vec(UserResponse), Error), () => {
    try {
      // If caller is not owner, return error.
      if (!isUserOwner(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat semua pengguna.' });
      }

      // Return all users.
      const users = userStorage.values().map((user: typeof User) => generateUserResponse(user.id));
      return Ok(users);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves an user by ID.
   * @param id - The user ID.
   * @returns an user or an error.
   */
  getUser: query([Principal], Result(UserResponse, Error), (id) => {
    try {
      // If user does not exist, return error.
      if (!isUserExists(id)) {
        return Err({ NotFound: 'Pengguna tidak ditemukan.' });
      }

      // Return the user by id.
      const user = userStorage.get(id).Some;
      return Ok(generateUserResponse(user.id));
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves the caller profile.
   * @returns the caller profile or an error.
   */
  getCallerProfile: query([], Result(UserResponse, Error), () => {
    try {
      // Return the caller profile.
      const caller = userStorage.get(ic.caller()).Some;
      return Ok(generateUserResponse(caller.id));
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves the unverified users for the owner and admin.
   * @returns unverified users or an error.
   */
  getUnverifiedUsers: query([], Result(Vec(UserResponse), Error), () => {
    try {
      // If caller is not owner and admin, return error.
      if (!isUserOwner(ic.caller()) && !isUserAdmin(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat daftar pengguna.' });
      }

      // Get the caller from storage.
      const caller = userStorage.get(ic.caller()).Some;

      // Return unverified users.
      const unverifiedUsers = userStorage
        .values()
        .filter(
          (user: typeof User) =>
            !user.isVerified &&
            (caller.role === 'admin'
              ? user.role !== 'admin' &&
                (user.role !== 'patient' ? user.hospitalId.Some === caller.hospitalId.Some : true)
              : true)
        )
        .map((user: typeof User) => generateUserResponse(user.id));
      return Ok(unverifiedUsers);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves all doctor specializations by hospital ID for the owner and patient.
   * @param hospitalId - The hospital ID.
   * @returns all doctor specializations by hospital ID or an error.
   */
  getSpecializationsByHospital: query([text], Result(Vec(text), Error), (hospitalId) => {
    try {
      // If caller is not owner and patient, return error.
      if (!isUserOwner(ic.caller()) && !isUserPatient(ic.caller())) {
        return Err({
          Forbidden: 'Anda tidak memiliki akses untuk melihat semua spesialisasi dokter.',
        });
      }

      // If hospital does not exist, return error.
      if (!hospitalStorage.containsKey(hospitalId)) {
        return Err({ NotFound: 'Rumah sakit tidak ditemukan.' });
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
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves all doctors by hospital ID and specialization for the owner and patient.
   * @param hospitalId - The hospital ID.
   * @param specialization - The doctor specialization.
   * @returns all doctors by hospital ID and specialization or an error.
   */
  getDoctorsByHospitalAndSpecialization: query(
    [text, text],
    Result(Vec(UserResponse), Error),
    (hospitalId, specialization) => {
      try {
        // If caller does not exist, return error.
        if (!isUserExists(ic.caller())) {
          return Err({ NotFound: 'Anda belum terdaftar.' });
        }

        // If caller is not owner and patient, return error.
        if (!isUserOwner(ic.caller()) && !isUserPatient(ic.caller())) {
          return Err({
            Forbidden: 'Anda tidak memiliki akses untuk melihat semua dokter.',
          });
        }

        // If hospital does not exist, return error.
        if (!hospitalStorage.containsKey(hospitalId)) {
          return Err({ NotFound: 'Rumah sakit tidak ditemukan.' });
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
          )
          .map((user: typeof User) => generateUserResponse(user.id));
        return Ok(doctors);
      } catch (error) {
        // If any error occurs, return it.
        return Err({ InternalError: 'Terjadi kesalahan.' });
      }
    }
  ),

  /**
   * Updates the schedules by the caller for the doctor.
   * @param schedules - The schedules.
   * @returns the updated caller or an error.
   */
  updateCallerSchedules: update(
    [Vec(Record({ startTime: text, endTime: text, isActive: bool }))],
    Result(UserResponse, Error),
    (schedules) => {
      try {
        // If caller is not doctor, return error.
        if (!isUserDoctor(ic.caller())) {
          return Err({ Forbidden: 'Anda tidak memiliki akses untuk mengubah jadwal praktek.' });
        }

        // If schedules length is not 7, return error.
        if (schedules.length !== 7) {
          return Err({ BadRequest: 'Jadwal praktek harus 7 hari.' });
        }

        // Get the caller from storage.
        const caller = userStorage.get(ic.caller()).Some;

        // Update the caller schedules and return it.
        const updatedCaller = {
          ...caller,
          schedules: Some(schedules),
          updatedAt: ic.time(),
        };
        userStorage.insert(caller.id, updatedCaller);
        return Ok(generateUserResponse(updatedCaller.id));
      } catch (error) {
        // If any error occurs, return it.
        return Err({ InternalError: 'Terjadi kesalahan.' });
      }
    }
  ),

  /**
   * Reviews user registration by the owner and admin.
   * @param id - The user id.
   * @param isConfirmed - Whether the user is confirmed or not.
   * @returns the reviewed user or an error.
   */
  reviewUser: update([Principal, bool], Result(UserResponse, Error), (id, isConfirmed) => {
    try {
      // If caller is not owner and admin, return error.
      if (!isUserOwner(ic.caller()) && !isUserAdmin(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk meninjau pengguna.' });
      }

      // If user does not exist, return error.
      if (!isUserExists(id)) {
        return Err({ NotFound: 'Pengguna tidak ditemukan.' });
      }

      // Get the user from storage.
      const user = userStorage.get(id).Some;

      // If caller is admin and user is admin, return error.
      if (isUserAdmin(ic.caller()) && user.role === 'admin') {
        return Err({ BadRequest: 'Anda tidak dapat meninjau akun admin.' });
      }

      // If user is verified, return error.
      if (user.isVerified) {
        return Err({ BadRequest: 'Anda tidak dapat meninjau akun yang telah terverifikasi.' });
      }

      // If confirmed, verify the user and return it.
      if (isConfirmed) {
        const updatedUser = { ...user, isVerified: true, updatedAt: ic.time() };
        userStorage.insert(user.id, updatedUser);
        return Ok(generateUserResponse(updatedUser.id));
      }

      // If user is not confirmed, delete the user and return it.
      const deletedUser = generateUserResponse(user.id);
      userStorage.remove(user.id);
      return Ok(deletedUser);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /* -------------------- APPOINTMENT -------------------- */
  /**
   * Creates a new appointment with a doctor by the patient.
   * @param req - Request for creating a new appointment.
   * @returns the created appointment or an error.
   */
  createAppointment: update([AppointmentRequest], Result(AppointmentResponse, Error), (req) => {
    try {
      // If caller is not patient, return error.
      if (!isUserPatient(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk membuat janji temu.' });
      }

      // If doctor does not exist, return error.
      if (!isUserExists(req.doctorId)) {
        return Err({ NotFound: 'Dokter tidak ditemukan.' });
      }

      // If doctor is not verified, return error.
      if (!isUserVerified(req.doctorId)) {
        return Err({ BadRequest: 'Dokter belum terverifikasi.' });
      }

      // If doctor is not doctor, return error.
      if (!isUserDoctor(req.doctorId)) {
        return Err({ BadRequest: 'Dokter tidak tersedia.' });
      }

      // If date time is less or equal than current time, return error.
      if (req.startTime <= ic.time()) {
        return Err({ BadRequest: 'Waktu yang dipilih harus setelah waktu saat ini.' });
      }

      // If doctor is not available, return error.
      if (!isDoctorAvailable(req.doctorId, req.startTime)) {
        return Err({ BadRequest: 'Dokter tidak tersedia pada waktu yang dipilih.' });
      }

      // Create new appointment, insert it into storage and return it.
      const newAppointment = {
        ...req,
        id: uuidv4(),
        patientId: ic.caller(),
        endTime: req.startTime + BigInt(1_800_000_000_000),
        isConfirmed: false,
        createdAt: ic.time(),
        updatedAt: ic.time(),
      };
      appointmentStorage.insert(newAppointment.id, newAppointment);
      return Ok(generateAppointmentResponse(newAppointment.id));
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves all appointments for for the owner.
   * @returns all appointments or an error.
   */
  getAllAppointments: query([], Result(Vec(AppointmentResponse), Error), () => {
    try {
      // If caller is not owner, return error.
      if (!isUserOwner(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat semua janji temu.' });
      }

      // Return all appointments.
      const appointments = appointmentStorage
        .values()
        .map((appointment: typeof Appointment) => generateAppointmentResponse(appointment.id));
      return Ok(appointments);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves an appointment by ID.
   * @returns an appointment or an error.
   */
  getAppointment: query([text], Result(AppointmentResponse, Error), (id) => {
    try {
      // If appointment does not exist, return error.
      if (!isAppointmentExists(id)) {
        return Err({ NotFound: 'Janji temu tidak ditemukan.' });
      }

      // Return the appointment by id.
      const appointment = appointmentStorage.get(id).Some;
      return Ok(generateAppointmentResponse(appointment.id));
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves the upcoming caller appointments for the patient and doctor.
   * @returns the upcoming caller appointments or an error.
   */
  getUpcomingCallerAppointments: query([], Result(Vec(AppointmentResponse), Error), () => {
    try {
      // If caller is not patient and doctor, return error.
      if (!isUserPatient(ic.caller()) && !isUserDoctor(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat janji temu.' });
      }

      // Return the caller appointments filtered by caller id.
      const appointments = appointmentStorage
        .values()
        .filter(
          (appointment: typeof Appointment) =>
            (userStorage.get(ic.caller()).Some.role === 'patient'
              ? appointment.patientId.toText() === ic.caller().toText()
              : appointment.doctorId.toText() === ic.caller().toText()) &&
            appointment.startTime > ic.time()
        )
        .map((appointment: typeof Appointment) => generateAppointmentResponse(appointment.id));
      return Ok(appointments);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves the past caller appointments for the patient and doctor.
   * @returns the past caller appointments or an error.
   */
  getPastCallerAppointments: query([], Result(Vec(AppointmentResponse), Error), () => {
    try {
      // If caller is not patient and doctor, return error.
      if (!isUserPatient(ic.caller()) && !isUserDoctor(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat janji temu.' });
      }

      // Return the caller appointments filtered by caller id.
      const appointments = appointmentStorage
        .values()
        .filter(
          (appointment: typeof Appointment) =>
            (userStorage.get(ic.caller()).Some.role === 'patient'
              ? appointment.patientId.toText() === ic.caller().toText()
              : appointment.doctorId.toText() === ic.caller().toText()) &&
            appointment.startTime <= ic.time()
        )
        .map((appointment: typeof Appointment) => generateAppointmentResponse(appointment.id));
      return Ok(appointments);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves the upcoming doctor appointments by doctor ID for the patient.
   * @param doctorId - The doctor ID.
   * @returns the upcoming doctor appointments by doctor ID or an error.
   */
  getUpcomingDoctorAppointments: query(
    [Principal],
    Result(Vec(AppointmentResponse), Error),
    (doctorId) => {
      try {
        // If caller is not patient, return error.
        if (!isUserPatient(ic.caller())) {
          return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat janji temu.' });
        }

        // If doctor does not exist, return error.
        if (!isUserExists(doctorId)) {
          return Err({ NotFound: 'Dokter tidak ditemukan.' });
        }

        // Return the upcoming doctor appointments by doctor ID.
        const appointments = appointmentStorage
          .values()
          .filter(
            (appointment: typeof Appointment) =>
              appointment.doctorId.toText() === doctorId.toText() &&
              appointment.startTime > ic.time() &&
              appointment.isConfirmed
          )
          .map((appointment: typeof Appointment) => generateAppointmentResponse(appointment.id));
        return Ok(appointments);
      } catch (error) {
        // If any error occurs, return it.
        return Err({ InternalError: 'Terjadi kesalahan.' });
      }
    }
  ),

  /**
   * Deletes the appointment by the patient.
   * @param id - The appointment id.
   * @returns the deleted appointment or an error.
   */
  deleteAppointment: update([text], Result(AppointmentResponse, Error), (id) => {
    try {
      // If caller is not patient, return error.
      if (!isUserPatient(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk menghapus janji temu.' });
      }

      // If appointment does not exist, return error.
      if (!isAppointmentExists(id)) {
        return Err({ NotFound: 'Janji temu tidak ditemukan.' });
      }

      // Get the appointment from storage.
      const appointment = appointmentStorage.get(id).Some;

      // If caller is not the patient of the appointment, return error.
      if (appointment.patientId.toText() !== ic.caller().toText()) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk menghapus janji temu.' });
      }

      // If appointment is already confirmed, return error.
      if (appointment.isConfirmed) {
        return Err({ BadRequest: 'Janji temu telah disetujui.' });
      }

      // Delete the appointment and return it.
      const deletedAppointment = generateAppointmentResponse(appointment.id);
      appointmentStorage.remove(appointment.id);
      return Ok(deletedAppointment);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Reviews the appointment by the doctor.
   * @param id - The appointment id.
   * @param isConfirmed - Whether the appointment is confirmed or not.
   * @returns the reviewed appointment or an error.
   */
  reviewAppointment: update([text, bool], Result(AppointmentResponse, Error), (id, isConfirmed) => {
    try {
      // If caller is not doctor, return error.
      if (!isUserDoctor(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk meninjau janji temu.' });
      }

      // If appointment does not exist, return error.
      if (!isAppointmentExists(id)) {
        return Err({ NotFound: 'Janji temu tidak ditemukan.' });
      }

      // Get the appointment from storage.
      const appointment = appointmentStorage.get(id).Some;

      // If caller is not the doctor of the appointment, return error.
      if (appointment.doctorId.toText() !== ic.caller().toText()) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk meninjau janji temu.' });
      }

      // If appointment is already confirmed, return error.
      if (appointment.isConfirmed) {
        return Err({ BadRequest: 'Janji temu telah disetujui.' });
      }

      // If date time is less or equal than current time, return error.
      if (appointment.dateTime <= ic.time()) {
        return Err({ BadRequest: 'Waktu janji temu harus setelah waktu saat ini.' });
      }

      // If confirmed:
      // 1) Confirm the appointment.
      // 2) Create new medical record.
      // 3) Delete all unconfirmed appointments with the same doctor and start time.
      // 4) Return the appointment.
      if (isConfirmed) {
        const updatedAppointment = { ...appointment, isConfirmed: true, updatedAt: ic.time() };
        const newMedicalRecord = {
          id: uuidv4(),
          patientId: updatedAppointment.patientId,
          doctorId: ic.caller(),
          appointmentId: updatedAppointment.id,
          hospitalId: updatedAppointment.hospitalId,
          height: None,
          weight: None,
          bloodPressure: None,
          pulse: None,
          temperature: None,
          respiration: None,
          subjective: None,
          objective: None,
          assessment: None,
          plan: None,
          education: None,
          prescriptions: None,
          createdAt: ic.time(),
          updatedAt: ic.time(),
        };
        appointmentStorage.insert(appointment.id, updatedAppointment);
        medicalRecordStorage.insert(newMedicalRecord.id, newMedicalRecord);
        appointmentStorage
          .values()
          .filter(
            (appointment: typeof Appointment) =>
              appointment.doctorId.toText() === updatedAppointment.doctorId.toText() &&
              appointment.startTime === updatedAppointment.startTime &&
              !appointment.isConfirmed
          )
          .forEach((appointment: typeof Appointment) => appointmentStorage.remove(appointment.id));
        return Ok(generateAppointmentResponse(updatedAppointment.id));
      }

      // If appointment is not confirmed, delete the appointment and return it.
      const deletedAppointment = generateAppointmentResponse(appointment.id);
      appointmentStorage.remove(appointment.id);
      return Ok(deletedAppointment);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /* -------------------- MEDICAL RECORD -------------------- */
  /**
   * Retrieves all medical records for the owner.
   * @returns all medical records or an error.
   */
  getAllMedicalRecords: query([], Result(Vec(MedicalRecordResponse), Error), () => {
    try {
      // If caller is not owner, return error.
      if (!isUserOwner(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat semua rekam medis.' });
      }

      // Return all medical records.
      const medicalRecords = medicalRecordStorage
        .values()
        .map((medicalRecord: typeof MedicalRecord) =>
          generateMedicalRecordResponse(medicalRecord.id)
        );
      return Ok(medicalRecords);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves a medical record by ID.
   * @param id - The medical record ID.
   * @returns a medical record or an error.
   */
  getMedicalRecord: query([text], Result(MedicalRecordResponse, Error), (id) => {
    try {
      // If medical record does not exist, return error.
      if (!isMedicalRecordExists(id)) {
        return Err({ NotFound: 'Rekam medis tidak ditemukan.' });
      }

      // Return the medical record by id.
      const medicalRecord = medicalRecordStorage.get(id).Some;
      return Ok(generateMedicalRecordResponse(medicalRecord.id));
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves the caller medical records for the patient.
   * @returns the caller medical records or an error.
   */
  getCallerMedicalRecords: query([], Result(Vec(MedicalRecordResponse), Error), () => {
    try {
      // If caller is not patient, return error.
      if (!isUserPatient(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat rekam medis.' });
      }

      // Return the caller medical records.
      const medicalRecords = medicalRecordStorage
        .values()
        .filter(
          (medicalRecord: typeof MedicalRecord) =>
            medicalRecord.patientId.toText() === ic.caller().toText()
        )
        .map((medicalRecord: typeof MedicalRecord) =>
          generateMedicalRecordResponse(medicalRecord.id)
        );
      return Ok(medicalRecords);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves the patient medical records by patient ID for the doctor and nurse.
   * @param patientId - The patient ID.
   * @returns the patient medical records or an error.
   */
  getPatientMedicalRecords: query(
    [Principal],
    Result(Vec(MedicalRecordResponse), Error),
    (patientId) => {
      try {
        // If caller is not doctor and nurse, return error.
        if (!isUserDoctor(ic.caller()) && !isUserNurse(ic.caller())) {
          return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat rekam medis.' });
        }

        // If patient does not exist, return error.
        if (!isUserExists(patientId)) {
          return Err({ NotFound: 'Pasien tidak ditemukan.' });
        }

        // Return the patient medical records by patient id.
        const medicalRecords = medicalRecordStorage
          .values()
          .filter(
            (medicalRecord: typeof MedicalRecord) =>
              medicalRecord.patientId.toText() === patientId.toText()
          )
          .map((medicalRecord: typeof MedicalRecord) =>
            generateMedicalRecordResponse(medicalRecord.id)
          );
        return Ok(medicalRecords);
      } catch (error) {
        // If any error occurs, return it.
        return Err({ InternalError: 'Terjadi kesalahan.' });
      }
    }
  ),

  /**
   * Retrieves all uncompleted medical records by caller hospital ID for the doctor.
   * @returns all uncompleted medical records or an error.
   */
  getUncompletedMedicalRecordsByDoctor: query([], Result(Vec(MedicalRecordResponse), Error), () => {
    try {
      // If caller is not doctor, return error.
      if (!isUserDoctor(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat rekam medis.' });
      }

      // Return all uncompleted medical records.
      const medicalRecords = medicalRecordStorage
        .values()
        .filter(
          (medicalRecord: typeof MedicalRecord) =>
            isAppointmentFinished(medicalRecord.appointmentId) &&
            medicalRecord.doctorId.toText() === ic.caller().toText() &&
            'None' in medicalRecord.subjective &&
            'None' in medicalRecord.objective &&
            'None' in medicalRecord.assessment &&
            'None' in medicalRecord.plan &&
            'None' in medicalRecord.education &&
            'None' in medicalRecord.prescriptions
        )
        .map((medicalRecord: typeof MedicalRecord) =>
          generateMedicalRecordResponse(medicalRecord.id)
        );
      return Ok(medicalRecords);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Retrieves all uncompleted medical records by caller hospital ID for the nurse.
   * @returns all uncompleted medical records or an error.
   */
  getUncompletedMedicalRecordsByNurse: query([], Result(Vec(MedicalRecordResponse), Error), () => {
    try {
      // If caller is not nurse, return error.
      if (!isUserNurse(ic.caller())) {
        return Err({ Forbidden: 'Anda tidak memiliki akses untuk melihat rekam medis.' });
      }

      // Return all uncompleted medical records.
      const medicalRecords = medicalRecordStorage
        .values()
        .filter(
          (medicalRecord: typeof MedicalRecord) =>
            isAppointmentFinished(medicalRecord.appointmentId) &&
            medicalRecord.hospitalId === userStorage.get(ic.caller()).Some.hospitalId.Some &&
            'None' in medicalRecord.height &&
            'None' in medicalRecord.weight &&
            'None' in medicalRecord.bloodPressure &&
            'None' in medicalRecord.pulse &&
            'None' in medicalRecord.temperature &&
            'None' in medicalRecord.respiration
        )
        .map((medicalRecord: typeof MedicalRecord) =>
          generateMedicalRecordResponse(medicalRecord.id)
        );
      return Ok(medicalRecords);
    } catch (error) {
      // If any error occurs, return it.
      return Err({ InternalError: 'Terjadi kesalahan.' });
    }
  }),

  /**
   * Updates the patient medical record by the doctor and nurse.
   * @param id - The medical record id.
   * @param req - Request for updating the medical record.
   * @returns the updated medical record or an error.
   */
  updatePatientMedicalRecord: update(
    [text, MedicalRecordRequest],
    Result(MedicalRecordResponse, Error),
    (id, req) => {
      try {
        // If caller is not doctor and nurse, return error.
        if (!isUserDoctor(ic.caller()) && !isUserNurse(ic.caller())) {
          return Err({ Forbidden: 'Anda tidak memiliki akses untuk mengubah rekam medis.' });
        }

        // If medical record does not exist, return error.
        if (!isMedicalRecordExists(id)) {
          return Err({ NotFound: 'Rekam medis tidak ditemukan.' });
        }

        // Get the medical record from storage.
        const medicalRecord = medicalRecordStorage.get(id).Some;

        // Update the medical record and return it.
        const updatedMedicalRecord = {
          ...medicalRecord,
          height: isUserDoctor(ic.caller()) ? medicalRecord.height : Some(req.height),
          weight: isUserDoctor(ic.caller()) ? medicalRecord.weight : Some(req.weight),
          bloodPressure: isUserDoctor(ic.caller())
            ? medicalRecord.bloodPressure
            : Some(req.bloodPressure),
          pulse: isUserDoctor(ic.caller()) ? medicalRecord.pulse : Some(req.pulse),
          temperature: isUserDoctor(ic.caller())
            ? medicalRecord.temperature
            : Some(req.temperature),
          respiration: isUserDoctor(ic.caller())
            ? medicalRecord.respiration
            : Some(req.respiration),
          subjective: isUserDoctor(ic.caller()) ? Some(req.subjective) : medicalRecord.subjective,
          objective: isUserDoctor(ic.caller()) ? Some(req.objective) : medicalRecord.objective,
          assessment: isUserDoctor(ic.caller()) ? Some(req.assessment) : medicalRecord.assessment,
          plan: isUserDoctor(ic.caller()) ? Some(req.plan) : medicalRecord.plan,
          prescriptions: isUserDoctor(ic.caller())
            ? Some(req.prescriptions)
            : medicalRecord.prescriptions,
          education: isUserDoctor(ic.caller()) ? Some(req.education) : medicalRecord.education,
          updatedAt: ic.time(),
        };
        medicalRecordStorage.insert(medicalRecord.id, updatedMedicalRecord);
        return Ok(generateMedicalRecordResponse(updatedMedicalRecord.id));
      } catch (error) {
        // If any error occurs, return it.
        return Err({ InternalError: 'Terjadi kesalahan.' });
      }
    }
  ),
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

// Export all types of the record.
export type Hospital = typeof HospitalResponse;
export type HospitalPayload = typeof HospitalRequest;
export type User = typeof UserResponse;
export type UserPayload = typeof UserRequest;
export type Appointment = typeof AppointmentResponse;
export type AppointmentPayload = typeof AppointmentRequest;
export type MedicalRecord = typeof MedicalRecordResponse;
export type MedicalRecordPayload = typeof MedicalRecordRequest;
export type Error = typeof Error;
