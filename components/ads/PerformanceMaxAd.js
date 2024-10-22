const PerformanceMaxAd = ({ ad }) => {
  return (
    <div>
      <h3>Performance Max Ad</h3>
      <p>Headline: {ad.adCopy.headline.join(', ')}</p>
      <p>Description: {ad.adCopy.description.join(', ')}</p>
      <p>Final URL: {ad.adCopy.finalUrl}</p>
      <p>Call to Action: {ad.adCopy.callToAction}</p>
      <p>Business Name: {ad.adCopy.businessName}</p>
      <p>Image URL: {ad.adCopy.imageUrl}</p>
      <p>Logo URL: {ad.adCopy.logoUrl}</p>
      <p>Video URLs: {ad.adCopy.videoUrl.join(', ')}</p>
    </div>
  );
};

export default PerformanceMaxAd;
