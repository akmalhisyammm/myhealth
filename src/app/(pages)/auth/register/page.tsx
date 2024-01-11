import { APP_NAME, APP_URL } from '@/lib/constants/meta';
import { RegisterPage } from '@/lib/components/templates';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar',
  alternates: {
    canonical: '/auth/register',
  },
  openGraph: {
    title: `Daftar | ${APP_NAME}`,
    url: `${APP_URL}/auth/register`,
  },
};

const Register = () => {
  return <RegisterPage />;
};

export default Register;
