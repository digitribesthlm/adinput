const SearchAd = ({ ad }) => {
  return (
    <div>
      <h3>Search Ad</h3>
      <p>Headline: {ad.adCopy.headline}</p>
      <p>Description: {ad.adCopy.description}</p>
      <p>Final URL: {ad.adCopy.finalUrl}</p>
    </div>
  );
};

export default SearchAd;
