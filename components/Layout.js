// components/Layout.js

import Head from 'next/head';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Layout({ children }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Ad Input System</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                Ad Input System
              </Link>
            </div>
            <div className="flex items-center">
              {session ? (
                <>
                  <span className="text-gray-700 mr-4">{session.user.name}</span>
                  <button onClick={() => signOut()} className="btn btn-sm btn-outline">
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/login" className="btn btn-sm btn-primary">
                  Sign in
                </Link>
              )}
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