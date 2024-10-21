// pages/admin/add-customer.js

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AddCustomerForm from '../../components/AddCustomerForm';

export default function AddCustomerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const handleCustomerAdded = (newCustomer) => {
    alert(`Customer ${newCustomer.name} added successfully!`);
    // Optionally, you can redirect to the dashboard or clear the form
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Add New Customer</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <AddCustomerForm onCustomerAdded={handleCustomerAdded} />
        </div>
      </div>
    </Layout>
  );
}