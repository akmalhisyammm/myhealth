import { APP_NAME, APP_URL } from '@/lib/constants/meta';
import { AppointmentsPage } from '@/lib/components/templates';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Janji Temu',
  alternates: {
    canonical: '/main/appointments',
  },
  openGraph: {
    title: `Janji Temu | ${APP_NAME}`,
    url: `${APP_URL}/main/appointments`,
  },
};

const Appointments = () => {
  return <AppointmentsPage />;
};

export default Appointments;
