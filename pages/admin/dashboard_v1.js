// pages/admin/dashboard.js

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({ totalCampaigns: 0, activeCampaigns: 0, completedCampaigns: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard-data');
      const data = await response.json();
      setCampaigns(data.campaigns);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
        alert(`Token generated: ${data.token}\nURL: ${window.location.origin}/input/${data.token}`);
        fetchDashboardData(); // Refresh the campaign list
      } else {
        alert('Failed to generate token');
      }
    } catch (error) {
      console.error('Error generating token:', error);
      alert('An error occurred while generating the token');
    }
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
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Total Campaigns</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalCampaigns}</div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Active Campaigns</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.activeCampaigns}</div>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Completed Campaigns</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{stats.completedCampaigns}</div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.platform}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.adType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => generateToken(campaign._id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Generate Token
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}