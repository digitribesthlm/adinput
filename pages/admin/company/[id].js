// pages/admin/company/[id].js -

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';

export default function CompanyCampaigns() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [company, setCompany] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && id) {
      fetchCompanyCampaigns();
    }
  }, [status, router, id]);

  const fetchCompanyCampaigns = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/company-campaigns?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch company campaigns');
      }
      const data = await response.json();
      setCompany(data.company);
      setCampaigns(data.campaigns);
    } catch (error) {
      console.error('Error fetching company campaigns:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateToken = async (campaignId) => {
    try {
      const response = await fetch('/api/admin/generate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaignId }),
      });
      const data = await response.json();
      if (response.ok) {
        const accessUrl = `${window.location.origin}/input/${data.token}`;
        await navigator.clipboard.writeText(accessUrl);
        alert(`Token copied to clipboard!\n\nAccess URL: ${accessUrl}`);
      } else {
        alert('Failed to generate token');
      }
    } catch (error) {
      console.error('Error generating token:', error);
      alert('An error occurred while generating the token');
    }
  };

  if (status === 'loading' || (isLoading && !error)) {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (!session) {
    return null;
  }

  if (error) {
    return <Layout><div>Error: {error}</div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Campaigns for {company?.name || 'Unknown Company'}</h1>
        
        {campaigns.length === 0 ? (
          <p>No campaigns found for this company.</p>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.platform}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.adType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(campaign.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.dueDate ? new Date(campaign.dueDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => generateToken(campaign._id)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Copy Link
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}