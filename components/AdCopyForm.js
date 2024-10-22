// components/AdCopyForm.js

import { useEffect, useState } from 'react';

const AdCopyForm = ({ initialPlatform, initialAdType, campaignId, tokenBased = false, token }) => {
  const [adPlatforms, setAdPlatforms] = useState({});
  const [adTypes, setAdTypes] = useState({});
  const [adTypeFields, setAdTypeFields] = useState({});
  const [adPlatform, setAdPlatform] = useState(initialPlatform);
  const [adType, setAdType] = useState(initialAdType);
  const [adCopy, setAdCopy] = useState({});
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [platformName, setPlatformName] = useState('');
  const [adTypeName, setAdTypeName] = useState('');

  useEffect(() => {
    fetchAdData();
  }, []);

  useEffect(() => {
    if (Object.keys(adTypeFields).length > 0 && adPlatform && adType) {
      initializeAdCopy(adPlatform, adType);
      updateTitleNames();
      setIsLoading(false);
    }
  }, [adTypeFields, adPlatform, adType]);

  const updateTitleNames = () => {
    if (adTypeFields[adPlatform] && adTypeFields[adPlatform][adType]) {
      setPlatformName(adPlatform);
      setAdTypeName(adType);
    }
  };

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
    checkWarnings(field, value);
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;
    Object.entries(adTypeFields[adPlatform]?.[adType] || {}).forEach(([field, requirements]) => {
      if (!requirements.optional && (!adCopy[field] || (Array.isArray(adCopy[field]) && adCopy[field].filter(v => v !== '').length < requirements.min))) {
        formErrors[field] = 'This field is required';
        isValid = false;
      }
      if (Array.isArray(adCopy[field])) {
        adCopy[field].forEach((value, index) => {
          if (value.length > requirements.charLimit) {
            formErrors[`${field}-${index}`] = `Character limit of ${requirements.charLimit} exceeded!`;
            isValid = false;
          }
        });
      } else {
        if (adCopy[field]?.length > requirements.charLimit) {
          formErrors[field] = `Character limit of ${requirements.charLimit} exceeded!`;
          isValid = false;
        }
      }
    });
    setErrors(formErrors);
    setIsFormValid(isValid);
  };

  const checkWarnings = (field, value) => {
    const fieldRequirements = adTypeFields[adPlatform]?.[adType]?.[field];
    const newWarnings = { ...warnings };

    if (fieldRequirements && value.length > fieldRequirements.charLimit) {
      newWarnings[field] = `Character limit of ${fieldRequirements.charLimit} exceeded!`;
    } else {
      delete newWarnings[field];
    }

    setWarnings(newWarnings);
  };

  const handleSave = async () => {
    if (!isFormValid) {
      alert('Please fix the errors before saving the form.');
      return;
    }
    try {
      const response = await fetch('/api/save-ad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaignId, platform: adPlatform, adType, adCopy, createdAt: new Date(), token: token }),
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

  const countCharacters = (text) => text?.length || 0;

  if (isLoading) {
    return <div>Loading ad data...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">
        {platformName && adTypeName 
          ? `${platformName} - ${adTypeName}`
          : 'Ad Input Form'
        }
      </h1>
      {adPlatform && adType ? (
        Object.keys(adTypeFields[adPlatform]?.[adType] || {}).map((field) => {
          const fieldRequirements = adTypeFields[adPlatform][adType][field];
          return (
            <div key={field} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <label className="block text-gray-700 font-bold">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <div className="text-sm text-gray-600">
                  {fieldRequirements.min === fieldRequirements.max ? (
                    <span>Required: {fieldRequirements.min}</span>
                  ) : (
                    <span>
                      Required: {fieldRequirements.min} - {fieldRequirements.max}
                    </span>
                  )}
                  <span className="ml-2">• Max {fieldRequirements.charLimit} characters</span>
                </div>
              </div>
              
              {Array.isArray(adCopy[field]) ? (
                adCopy[field].map((value, index) => (
                  <div key={index} className="mb-2 flex items-center">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(field, index, e.target.value)}
                      className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors[`${field}-${index}`] ? 'border-red-500' : ''}`}
                      placeholder={`${field} ${index + 1}`}
                    />
                    <span className="ml-2 text-xs text-gray-500">
                      {countCharacters(value)} / {fieldRequirements.charLimit}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={adCopy[field] || ''}
                    onChange={(e) => handleInputChange(field, 0, e.target.value)}
                    className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors[field] ? 'border-red-500' : ''}`}
                    placeholder={field}
                  />
                  <span className="ml-2 text-xs text-gray-500">
                    {countCharacters(adCopy[field])} / {fieldRequirements.charLimit}
                  </span>
                </div>
              )}
              
              {errors[field] && (
                <p className="text-red-500 text-xs italic mt-2">{errors[field]}</p>
              )}
              
              {Array.isArray(adCopy[field]) && adCopy[field].length < fieldRequirements.max && (
                <button
                  onClick={() => addField(field)}
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add {field}
                </button>
              )}
            </div>
          );
        })
      ) : (
        <div>
          <p>Please select a platform and ad type:</p>
          <select 
            value={adPlatform}
            onChange={(e) => setAdPlatform(e.target.value)}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Platform</option>
            {Object.keys(adPlatforms).map((platform) => (
              <option key={platform} value={platform}>
                {adPlatforms[platform]}
              </option>
            ))}
          </select>
          <select
            value={adType}
            onChange={(e) => setAdType(e.target.value)}
            className="mt-4 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Ad Type</option>
            {Object.keys(adTypes[adPlatform] || {}).map((type) => (
              <option key={type} value={type}>
                {adTypes[adPlatform][type]}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        onClick={handleSave}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isFormValid}
      >
        Save Ad
      </button>
    </div>
  );
};

export default AdCopyForm;
