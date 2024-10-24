// pages/admin/token-ads/[token].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import PerformanceMaxAd from '../../../components/ads/PerformanceMaxAd';
import SearchAd from '../../../components/ads/SearchAd';
import CarouselAd from '../../../components/ads/CarouselAd';

export default function TokenAds() {
  const router = useRouter();
  const { token } = router.query;
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchAds();
    }
  }, [token]);

  const fetchAds = async () => {
    try {
      const response = await fetch(`/api/admin/token-ads?token=${token}`);
      const data = await response.json();
      setAds(data.ads);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Layout><div>Fetching ads...</div></Layout>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Ads Created with Token: {token}</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Headline</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTA</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ads.map((ad) => (
                <tr key={ad._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ad.platform}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ad.adType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ad.adType === 'Performance Max' && ad.adCopy.headline && (Array.isArray(ad.adCopy.headline) ? ad.adCopy.headline.join(', ') : ad.adCopy.headline)}
                    {ad.adType === 'Search' && ad.adCopy.headline}
                    {ad.adType === 'Carousel' && ad.adCopy.headline}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ad.adType === 'Performance Max' && ad.adCopy.description && (Array.isArray(ad.adCopy.description) ? ad.adCopy.description.join(', ') : ad.adCopy.description)}
                    {ad.adType === 'Search' && ad.adCopy.description}
                    {ad.adType === 'Carousel' && ad.adCopy.description}  
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ad.adType === 'Performance Max' && ad.adCopy.callToAction}
                    {ad.adType === 'Carousel' && ad.adCopy.callToAction}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ad.createdAt).toLocaleString()}
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
