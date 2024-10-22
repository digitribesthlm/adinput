// components/Layout.js -

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';

export default function Layout({ children }) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="flex-shrink-0">
                <span className="text-white font-bold text-xl">Ad Input System</span>
              </Link>
              {session && (
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link
                      href="/admin/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        router.pathname === '/admin/dashboard'
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/admin/add-customer"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        router.pathname === '/admin/add-customer'
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      Add Customer
                    </Link>
                    <Link
                      href="/admin/add-campaign"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        router.pathname === '/admin/add-campaign'
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      Add Campaign
                    </Link>
                    <Link
                      href="/admin/token-management"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        router.pathname === '/admin/token-management'
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      Token Management
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {session ? (
                  <button
                    onClick={() => signOut()}
                    className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">Sign out</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">Sign in</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}