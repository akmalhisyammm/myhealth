import { APP_NAME, APP_URL } from '@/lib/constants/meta';
import { VerifyUsersPage } from '@/lib/components/templates';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verifikasi Pengguna',
  alternates: {
    canonical: '/main/verify-users',
  },
  openGraph: {
    title: `Verifikasi Pengguna | ${APP_NAME}`,
    url: `${APP_URL}/main/verify-users`,
  },
};

const VerifyUsers = () => {
  return <VerifyUsersPage />;
};

export default VerifyUsers;
