// pages/admin/add-campaign.js

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import AddCampaignForm from '../../components/AddCampaignForm';

export default function AddCampaignPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchCompanies();
    }
  }, [status, router]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/admin/get-companies');
      const data = await response.json();
      setCompanies(data.companies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCampaignAdded = (newCampaign) => {
    alert(`Campaign for ${newCampaign.companyName} added successfully!`);
    router.push('/admin/dashboard');
  };

  if (status === 'loading' || isLoading) {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Add New Campaign</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <AddCampaignForm companies={companies} onCampaignAdded={handleCampaignAdded} />
        </div>
      </div>
    </Layout>
  );
}