'use client';

import { Disclosure } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MetaMask from './MetaMask'; // Import the MetaMask component

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'New Post', href: '/thread' }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar({ user }: { user: any }) {
  const pathname = usePathname();
  // const metamask_connection = window.ethereum.isConnected() ? ;

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                {/* Main Navigation */}
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'border-slate-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ml-3'
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="flex items-center">
                {/* MetaMask button with some top padding */}
                {
                  <div className="mr-3">
                    <MetaMask />
                  </div>
                }

                {/* User profile picture */}
                <Image
                  className="h-8 w-8 rounded-full"
                  src={user?.image || 'https://avatar.vercel.sh/leerob'}
                  height={32}
                  width={32}
                  alt={`${user?.name || 'placeholder'} avatar`}
                  priority={false}
                />
                <Link
                  href="/profile"
                  className={classNames(
                    pathname === '/profile'
                      ? 'border-slate-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ml-3'
                  )}
                  aria-current={pathname === '/profile' ? 'page' : undefined}
                >
                  Profile
                </Link>
              </div>
            </div>
            {/* Remaining code stays the same */}
          </div>
          {/* Remaining code stays the same */}
        </>
      )}
    </Disclosure>
  );
}
