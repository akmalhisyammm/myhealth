'use client';

import { useContext } from 'react';

// import { APP_NAME, APP_URL } from '@/lib/constants/meta';
import { MainLayout } from '@/lib/components/layouts';
import { AuthContext } from '@/lib/contexts/auth';
import { DoctorSchedules } from '@/lib/components/organisms';

// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Dashboard',
//   alternates: {
//     canonical: '/main/dashboard',
//   },
//   openGraph: {
//     title: `Dashboard | ${APP_NAME}`,
//     url: `${APP_URL}/main/dashboard`,
//   },
// };

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return <MainLayout>{user?.role === 'doctor' && <DoctorSchedules />}</MainLayout>;
};

export default Dashboard;
