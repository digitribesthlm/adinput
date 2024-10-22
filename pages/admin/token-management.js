// pages/admin/token-management.js

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

export default function TokenManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [adCounts, setAdCounts] = useState({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchTokens();
    }
  }, [status, router]);

  const fetchTokens = async () => {
    try {
      const response = await fetch('/api/admin/tokens');
      const data = await response.json();
      setTokens(data.tokens);

      const adCountsResponse = await fetch('/api/admin/ad-counts');
      const adCountsData = await adCountsResponse.json();
      setAdCounts(adCountsData.adCounts);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTokens = tokens.filter(token => 
    (token.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     token.campaignType.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || token.status === statusFilter)
  );

  const handleCopyLink = async (token) => {
    const accessUrl = `${window.location.origin}/input/${token}`;
    await navigator.clipboard.writeText(accessUrl);
    alert(`Token copied to clipboard!\n\nAccess URL: ${accessUrl}`);
  };

  const calculateTimeLeft = (expiresAt) => {
    const expiresAtDate = new Date(expiresAt);
    const now = new Date();
    const timeDifference = expiresAtDate - now;
    if (timeDifference <= 0) return 'Expired';
    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    return `${daysLeft} day(s) left`;
  };

  if (status === 'loading') {
    return <Layout><div>Loading...</div></Layout>;
  }

  if (isLoading) {
    return <Layout><div>Fetching tokens...</div></Layout>;
  }

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Token Management</h1>
        
        <div className="mb-4 flex flex-wrap items-center">
          <input
            type="text"
            placeholder="Search by company or campaign type..."
            className="p-2 border rounded mr-4 mb-2 sm:mb-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="used">Used</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires At</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Left</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ads Created</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTokens.map((token) => (
                <tr key={token._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{token.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{token.campaignType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${token.status === 'active' ? 'bg-green-100 text-green-800' : 
                        token.status === 'used' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}> 
                      {token.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(token.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(token.expiresAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calculateTimeLeft(token.expiresAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/admin/token-ads/${token.token}`}>
                      <a className="text-blue-500 hover:text-blue-700">
                        {adCounts && adCounts[token.token] !== undefined ? adCounts[token.token] : 0}
                      </a>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleCopyLink(token.token)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Copy Link
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
