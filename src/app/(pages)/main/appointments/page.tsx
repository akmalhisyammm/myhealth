'use client';

import { useContext } from 'react';

// import { APP_NAME, APP_URL } from '@/lib/constants/meta';
import { AuthContext } from '@/lib/contexts/auth';
import { MainLayout } from '@/lib/components/layouts';
import { DoctorAppointments, PatientAppointments } from '@/lib/components/organisms';

// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Janji Temu',
//   alternates: {
//     canonical: '/main/appointments',
//   },
//   openGraph: {
//     title: `Janji Temu | ${APP_NAME}`,
//     url: `${APP_URL}/main/appointments`,
//   },
// };

const Appointments = () => {
  const { user } = useContext(AuthContext);

  return (
    <MainLayout>
      {user?.role === 'patient' && <PatientAppointments />}
      {user?.role === 'doctor' && <DoctorAppointments />}
    </MainLayout>
  );
};

export default Appointments;
