import { APP_NAME, APP_URL } from '@/lib/constants/meta';
import { MedicalRecordsPage } from '@/lib/components/templates';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rekam Medis',
  alternates: {
    canonical: '/main/medical-records',
  },
  openGraph: {
    title: `Rekam Medis | ${APP_NAME}`,
    url: `${APP_URL}/main/medical-records`,
  },
};

const MedicalRecords = () => {
  return <MedicalRecordsPage />;
};

export default MedicalRecords;
