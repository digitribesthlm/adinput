const PerformanceMaxAd = ({ ad }) => {
  return (
    <div>
      <h3>Performance Max Ad!</h3>
      <p>Headline: {Array.isArray(ad.adCopy.headline) ? ad.adCopy.headline.join(', ') : ad.adCopy.headline}</p>
      <p>Description: {Array.isArray(ad.adCopy.description) ? ad.adCopy.description.join(', ') : ad.adCopy.description}</p>
      <p>Final URL: {ad.adCopy.finalUrl}</p>
      <p>Call to Action: {ad.adCopy.callToAction}</p>
      <p>Business Name: {ad.adCopy.businessName}</p>
      <p>Image URL: {ad.adCopy.imageUrl}</p>
      <p>Logo URL: {ad.adCopy.logoUrl}</p>
      <p>Video URL(s): {Array.isArray(ad.adCopy.videoUrl) ? ad.adCopy.videoUrl.join(', ') : ad.adCopy.videoUrl}</p>
    </div>
  );
};

export default PerformanceMaxAd;
