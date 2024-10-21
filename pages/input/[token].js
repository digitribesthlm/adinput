import { useRouter } from 'next/router';
import { useEffect, useState } from 'eact';
import AdCopyForm from '../../components/AdCopyForm';

export default function TokenBasedAdInput() {
  const router = useRouter();
  const { token } = router.query;
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await fetch(`/api/validate-token?token=${token}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data.campaign);
      } else {
        setError('Invalid or expired token');
      }
    } catch (err) {
      setError('An error occurred while validating the token');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!campaign) return null;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ad Input for {campaign.companyName}</h1>
      <AdCopyForm 
        initialPlatform={campaign.platform}
        initialAdType={campaign.adType}
        campaignId={campaign._id}
        tokenBased={true}
      />
    </div>
  );
}