import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdCopyForm from '../../components/AdCopyForm';

export default function TokenBasedAdInput() {
  const router = useRouter();
  const { token } = router.query;
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasValidated, setHasValidated] = useState(false);

  useEffect(() => {
    if (token && !hasValidated) {
      validateToken();
      setHasValidated(true);
    }
  }, [token, hasValidated]);

  const validateToken = async () => {
    // ... existing code for validateToken ...
    try {
      const response = await fetch(`/api/validate-token?token=${token}`);
      if (response.ok) {
        const data = await response.json();
        if (data.campaign) {
          setCampaign(data.campaign);
        } else {
          setError('Campaign data is not available');
        }
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
  // Removed the check that returns null if there is no campaign
  // to ensure that the form is rendered even if the campaign is not set

  return (
    <div className="container mx-auto p-4">
      {campaign && (
        <>
          <h1 className="text-2xl font-bold mb-4">Ad Input for {campaign.companyName}</h1>
          <AdCopyForm 
            initialPlatform={campaign.platform}
            initialAdType={campaign.adType}
            campaignId={campaign._id}
            tokenBased={true}
          />
        </>
      )}
    </div>
  );
}
