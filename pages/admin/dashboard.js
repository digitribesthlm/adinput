import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [campaigns, setCampaigns] = useState(null);
  const [stats, setStats] = useState({ totalCampaigns: 0, activeCampaigns: 0, completedCampaigns: 0 });

  // Fetch the dashboard data when the user is authenticated
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
      const data = await response.json(); // Ensure that the API returns valid JSON
      console.log('Dashboard data:', data); // Log the fetched data to inspect it
      setCampaigns(data.campaigns);
      setStats(data.stats || {});
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Loading screen while session data is being fetched
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated, do not render the dashboard
  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6 p-4">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
          <p className="font-bold">Welcome, {session.user.name}!</p>
          <p>You are logged in as an admin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats && Object.entries(stats).map(([key, value]) => (
            <div key={key} className="bg-white shadow rounded-lg p-6">
              <div className="text-sm font-medium text-gray-500 truncate">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">{value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Campaigns</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Company', 'Platform', 'Ad Type', 'Status', 'Action'].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {campaigns === null ? (
                 <tr>
                   <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                     Loading campaigns...
                   </td>
                 </tr>
               ) : campaigns.length > 0 ? (
                  campaigns.map((campaign) => (
                    <tr key={campaign._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.companyName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.platform}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.adType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => alert(`View details for campaign ${campaign._id}`)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-md text-sm"
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => generateTokenForCampaign(campaign._id)}
                          className="ml-2 text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md text-sm"
                        >
                          Generate Token
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      No campaigns available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const generateTokenForCampaign = async (campaignId) => {
  try {
    const response = await fetch(`/api/generate-token?campaignId=${campaignId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        alert(`Token URL: ${window.location.origin}/input/${data.token}`);
      } else {
        alert('Token was not generated. Please try again.');
      }
    } else {
      const errorData = await response.json();
      alert(`Failed to generate token: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Error generating token:', error);
    alert('Error generating token');
  }
};
