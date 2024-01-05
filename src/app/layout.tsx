import { Providers } from './providers';
import { APP_DESCRIPTION, APP_NAME, APP_URL } from '@/lib/constants/meta';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s | ${APP_NAME}` },
  description: APP_DESCRIPTION,
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    type: 'website',
    locale: 'id_ID',
  },
  authors: [
    {
      name: 'Muhammad Syiarul Amrullah',
      url: 'https://github.com/muhammadarl',
    },
    {
      name: 'Muhammad Akmal Hisyam',
      url: 'https://github.com/akmalhisyammm',
    },
    {
      name: 'Rilo Anggoro Saputra',
      url: 'https://github.com/riloanggoro',
    },
    {
      name: 'Irwan Prasetyo',
      url: 'https://github.com/vroken',
    },
    {
      name: 'Dzul Jalali Wal Ikram',
      url: 'https://github.com/DzulJalali',
    },
  ],
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="id">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
