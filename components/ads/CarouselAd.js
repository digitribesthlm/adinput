const CarouselAd = ({ ad }) => {
  return (
    <div>
      <h3>Carousel Ad</h3>
      <p>Headline: {ad.adCopy.headline}</p>
      <p>Description: {ad.adCopy.description}</p>
      <p>Final URL: {ad.adCopy.finalUrl}</p>
      <p>Call to Action: {ad.adCopy.callToAction}</p>
      <p>Business Name: {ad.adCopy.businessName}</p>
      <p>Image URLs: {ad.adCopy.imageUrl.join(', ')}</p>
      <p>Logo URL: {ad.adCopy.logoUrl}</p>
      <p>Video URL: {ad.adCopy.videoUrl}</p>
    </div>
  );
};

export default CarouselAd;
