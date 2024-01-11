import { APP_NAME, APP_URL } from '@/lib/constants/meta';
import { DashboardPage } from '@/lib/components/templates';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  alternates: {
    canonical: '/main/dashboard',
  },
  openGraph: {
    title: `Dashboard | ${APP_NAME}`,
    url: `${APP_URL}/main/dashboard`,
  },
};

const Dashboard = () => {
  return <DashboardPage />;
};

export default Dashboard;
