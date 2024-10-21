// /compontents/AdCopyForm.js
import { useEffect, useState } from 'react'; // Corrected 'eact' to 'react'

const AdCopyForm = ({ initialPlatform, initialAdType, campaignId, tokenBased = false }) => {
  const [adPlatforms, setAdPlatforms] = useState({});
  const [adTypes, setAdTypes] = useState({});
  const [adTypeFields, setAdTypeFields] = useState({});
  const [adPlatform, setAdPlatform] = useState(tokenBased? initialPlatform : '');
  const [adType, setAdType] = useState(tokenBased? initialAdType : '');
  const [adCopy, setAdCopy] = useState({});
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdData();
  }, []);

  // Ensure that the adTypeFields data structure is correctly initialized
  useEffect(() => {
    if (Object.keys(adTypeFields).length > 0 && initialPlatform && initialAdType) {
      setAdPlatform(initialPlatform);
      setAdType(initialAdType);
      initializeAdCopy(initialPlatform, initialAdType);
    }
  }, [adTypeFields, initialPlatform, initialAdType]);

  useEffect(() => {
    if (adPlatform && adType && adTypeFields[adPlatform] && adTypeFields[adPlatform][adType]) {
      initializeAdCopy(adPlatform, adType);
    }
  }, [adPlatform, adType, adTypeFields]);

  const fetchAdData = async () => {
    try {
      const response = await fetch('/api/ad-data');
      const data = await response.json();
      setAdPlatforms(data.platforms);
      setAdTypes(data.types);
      setAdTypeFields(data.fields);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching ad data:', error);
      setIsLoading(false);
    }
  };

  const initializeAdCopy = (platform, type) => {
    const newAdCopy = {};
    Object.entries(adTypeFields[platform][type]).forEach(([field, requirements]) => {
      if (field === 'internalName') {
        newAdCopy[field] = '';
      } else if (!requirements.optional) {
        newAdCopy[field] = Array(requirements.min).fill('');
      } else {
        newAdCopy[field] = [];
      }
    });
    setAdCopy(newAdCopy);
    setErrors({});
    setIsFormValid(false);
  };

  const handlePlatformChange = (e) => {
    const newPlatform = e.target.value;
    setAdPlatform(newPlatform);
    setAdType(Object.keys(adTypes[newPlatform])[0]);
  };

  const handleAdTypeChange = (e) => {
    const newAdType = e.target.value;
    setAdType(newAdType);
  };

  const handleInputChange = (field, index, value) => {
    const updatedAdCopy = {...adCopy };
    if (Array.isArray(updatedAdCopy[field])) {
      updatedAdCopy[field][index] = value;
    } else {
      updatedAdCopy[field] = value;
    }
    setAdCopy(updatedAdCopy);
    validateForm();
  };

  const addField = (field) => {
    const updatedAdCopy = {...adCopy };
    if (Array.isArray(updatedAdCopy[field])) {
      updatedAdCopy[field].push('');
    } else {
      updatedAdCopy[field] = [updatedAdCopy[field], ''];
    }
    setAdCopy(updatedAdCopy);
    validateForm();
  };

  const removeField = (field, index) => {
    const updatedAdCopy = {...adCopy };
    if (Array.isArray(updatedAdCopy[field])) {
      updatedAdCopy[field].splice(index, 1);
      if (updatedAdCopy[field].length === 0) {
        delete updatedAdCopy[field];
      }
    } else {
      delete updatedAdCopy[field];
    }
    setAdCopy(updatedAdCopy);
    validateForm();
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;
    Object.entries(adTypeFields[adPlatform][adType]).forEach(([field, requirements]) => {
      if (!requirements.optional && (!adCopy[field] || (Array.isArray(adCopy[field]) && adCopy[field].length < requirements.min))) {
        formErrors[field] = 'This field is required';
        isValid = false;
      }
    });
    setErrors(formErrors);
    setIsFormValid(isValid);
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const response = await fetch('/api/save-ad', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            campaignId, 
            platform: adPlatform, 
            adType, 
            adCopy 
          }),
        });

        if (response.ok) {
          alert('Ad saved successfully!');
          if (tokenBased) {
            // Redirect or show a completion message for token-based users
          } else {
            initializeAdCopy(adPlatform, adType);
          }
        } else {
          alert('Failed to save ad');
        }
      } catch (error) {
        console.error('Error saving ad:', error);
        alert('An error occurred while saving the ad');
      }
    }
  };

  const renderInputs = (field) => {
    const requirements = adTypeFields[adPlatform][adType][field];
    if (Array.isArray(adCopy[field])) {
      return (
        <div key={field}>
          <label>{field}</label>
          {adCopy[field].map((value, index) => (
            <input 
              key={index} 
              type="text" 
              value={value} 
              onChange={(e) => handleInputChange(field, index, e.target.value)} 
              placeholder={requirements.placeholder} 
            />
          ))}
          <button onClick={() => addField(field)}>Add {field}</button>
          {adCopy[field].length > requirements.min && (
            <button onClick={() => removeField(field, adCopy[field].length - 1)}>Remove {field}</button>
          )}
        </div>
      );
    } else {
      return (
        <div key={field}>
          <label>{field}</label>
          <input 
            type="text" 
            value={adCopy[field]} 
            onChange={(e) => handleInputChange(field, null, e.target.value)} 
            placeholder={requirements.placeholder} 
          />
        </div>
      );
    }
  };

  if (isLoading) {
    return <div>Loading ad data...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Ad Copy Form</h1>
      
      {!tokenBased && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Ad Platform
            </label>
            <select
              value={adPlatform}
              onChange={handlePlatformChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a platform</option>
              {Object.keys(adPlatforms).map(platform => (
                <option key={platform} value={platform}>{adPlatforms[platform]}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Ad Type
            </label>
            <select
              value={adType}
              onChange={handleAdTypeChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
            >
              <option value="">Select an ad type</option>
              {adPlatform && Object.keys(adTypes[adPlatform]).map(type => (
                <option key={type} value={type}>{adTypes[adPlatform][type]}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {adPlatform && adType && adTypeFields[adPlatform] && adTypeFields[adPlatform][adType] && Object.keys(adTypeFields[adPlatform][adType]).map(renderInputs)}
      {adPlatform && adType && adTypeFields[adPlatform] && adTypeFields[adPlatform][adType] ? (
        Object.keys(adTypeFields[adPlatform][adType]).map(renderInputs)
      ) : (
        <div>No ad fields available for the selected platform and ad type.</div>
      )}

      <button
        onClick={handleSave}
        disabled={!isFormValid}
        className={`${isFormValid? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:border-blue-500`}
      >
        Save Ad
      </button>
      {!isFormValid && (
        <p className="text-red-500 text-xs italic mt-2">Please fill in all required fields before saving.</p>
      )}
    </div>
  );
};

export default AdCopyForm;
