// pages/index.js

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import AdCopyForm from '../components/AdCopyForm';
import LoginForm from '../components/LoginForm';

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <LoginForm />;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Ad Copy Input System</h1>
      <AdCopyForm />
    </div>
  );
}