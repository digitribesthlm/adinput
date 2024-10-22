// /pages/input/[token].js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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
        setCampaign(data.campaign || null);
      } else {
        setError('Invalid or expired token');
      }
    } catch (err) {
      setError('An error occurred while validating the token');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Validating token...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {campaign ? (
        <AdCopyForm 
          initialPlatform={campaign.platform}
          initialAdType={campaign.adType}
          campaignId={campaign._id}
          companyName={campaign.companyName}
          tokenBased={true}
          token={token}
        />
      ) : (
        <div>No campaign data available</div>
      )}
    </div>
  );
}
