import './styles/globals.css';

import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import Nav from '../components/nav';
import Toast from '../components/toast';


const inter = Inter({ subsets: ['latin'] });
export const metadata = {
  title: 'Griphtonite - User Dashboard',
  description:
    'A dashboard for posting blog-posts, comments and more.'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50 overflow-y-scroll">
      <body className="h-full">
        <Suspense>
          <Nav />
        </Suspense>
        {children}
        <Toast />
      </body>
    </html>
  );
}
