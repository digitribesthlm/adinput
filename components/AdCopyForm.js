// /components/AdCopyForm.js
import { useEffect, useState } from 'react';

const AdCopyForm = ({ initialPlatform, initialAdType, campaignId, tokenBased = false }) => {
  const [adPlatforms, setAdPlatforms] = useState({});
  const [adTypes, setAdTypes] = useState({});
  const [adTypeFields, setAdTypeFields] = useState({});
  const [adPlatform, setAdPlatform] = useState(initialPlatform);
  const [adType, setAdType] = useState(initialAdType);
  const [adCopy, setAdCopy] = useState({});
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdData();
  }, []);

  useEffect(() => {
    if (Object.keys(adTypeFields).length > 0 && adPlatform && adType) {
      initializeAdCopy(adPlatform, adType);
      setIsLoading(false);
    }
  }, [adTypeFields, adPlatform, adType]);

  const fetchAdData = async () => {
    try {
      const response = await fetch('/api/ad-data');
      const data = await response.json();
      setAdPlatforms(data.platforms);
      setAdTypes(data.types);
      setAdTypeFields(data.fields);
    } catch (error) {
      console.error('Error fetching ad data:', error);
    }
  };

  const initializeAdCopy = (platform, type) => {
    const newAdCopy = {};
    Object.entries(adTypeFields[platform][type] || {}).forEach(([field, requirements]) => {
      if (!requirements.optional) {
        newAdCopy[field] = Array(requirements.min).fill('');
      } else {
        newAdCopy[field] = [];
      }
    });
    setAdCopy(newAdCopy);
  };

  const handleInputChange = (field, index, value) => {
    const updatedAdCopy = { ...adCopy };
    if (Array.isArray(updatedAdCopy[field])) {
      updatedAdCopy[field][index] = value;
    } else {
      updatedAdCopy[field] = value;
    }
    setAdCopy(updatedAdCopy);
    validateForm();
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;
    Object.entries(adTypeFields[adPlatform]?.[adType] || {}).forEach(([field, requirements]) => {
      if (!requirements.optional && (!adCopy[field] || (Array.isArray(adCopy[field]) && adCopy[field].length < requirements.min))) {
        formErrors[field] = 'This field is required';
        isValid = false;
      }
    });
    setErrors(formErrors);
    setIsFormValid(isValid);
  };

  const handleSave = async () => {
    if (isFormValid) {
      try {
        const response = await fetch('/api/save-ad', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ campaignId, platform: adPlatform, adType, adCopy, createdAt: new Date() }),
        });
        if (response.ok) {
          alert('Ad saved successfully!');
        } else {
          alert('Failed to save ad');
        }
      } catch (error) {
        console.error('Error saving ad:', error);
        alert('An error occurred while saving the ad');
      }
    }
  };

  const addField = (field) => {
    const updatedAdCopy = { ...adCopy };
    if (Array.isArray(updatedAdCopy[field])) {
      if (updatedAdCopy[field].length < adTypeFields[adPlatform][adType][field].max) {
        updatedAdCopy[field].push('');
        setAdCopy(updatedAdCopy);
        validateForm();
      }
    }
  };

  const countCharacters = (text) => text.length;

  if (isLoading) {
    return <div>Loading ad data...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">{adPlatforms[adPlatform]} - {adTypes[adPlatform]?.[adType]}</h1>
      {adPlatform && adType ? (
        Object.keys(adTypeFields[adPlatform]?.[adType] || {}).map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{field}</label>
            {Array.isArray(adCopy[field]) ? (
              adCopy[field].map((value, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(field, index, e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    maxLength={adTypeFields[adPlatform][adType][field].charLimit}
                  />
                  <p className="text-xs text-gray-500">Characters: {countCharacters(value)} / {adTypeFields[adPlatform][adType][field].charLimit}</p>
                </div>
              ))
            ) : (
              <input
                type="text"
                value={adCopy[field] || ''}
                onChange={(e) => handleInputChange(field, 0, e.target.value)}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                maxLength={adTypeFields[adPlatform][adType][field].charLimit}
              />
            )}
            {errors[field] && <p className="text-red-500 text-xs italic mt-2">{errors[field]}</p>}
            {Array.isArray(adCopy[field]) && adCopy[field].length < adTypeFields[adPlatform][adType][field].max && (
              <button
                onClick={() => addField(field)}
                className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add {field}
              </button>
            )}
          </div>
        ))
      ) : (
        <div>No ad fields available for the selected platform and ad type.</div>
      )}
      <button
        onClick={handleSave}
        disabled={!isFormValid}
        className={`${isFormValid ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
      >
        Save Ad
      </button>
    </div>
  );
};

export default AdCopyForm;