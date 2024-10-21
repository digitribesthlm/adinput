// components/AddCampaignForm.js

import React, { useState, useEffect } from 'react';

const AddCampaignForm = ({ companies, onCampaignAdded }) => {
  const [companyId, setCompanyId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedAdType, setSelectedAdType] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [adTypes, setAdTypes] = useState({});
  const [adTypeFields, setAdTypeFields] = useState({});

  useEffect(() => {
    fetchPlatformsAndAdTypes();
  }, []);

  const fetchPlatformsAndAdTypes = async () => {
    try {
      const response = await fetch('/api/admin/get-platforms-and-ad-types');
      const data = await response.json();
      setPlatforms(data.platforms);
      setAdTypes(data.adTypes);
      setAdTypeFields(data.adTypeFields);
    } catch (error) {
      console.error('Error fetching platforms and ad types:', error);
      setError('Failed to load platforms and ad types');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/add-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyId, platform: selectedPlatform, adType: selectedAdType, dueDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to add campaign');
      }

      const data = await response.json();
      onCampaignAdded(data.campaign);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">
          Company
        </label>
        <select
          id="company"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select a company</option>
          {companies.map((company) => (
            <option key={company._id} value={company._id}>{company.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
          Platform
        </label>
        <select
          id="platform"
          value={selectedPlatform}
          onChange={(e) => {
            setSelectedPlatform(e.target.value);
            setSelectedAdType('');
          }}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select a platform</option>
          {platforms.map((platform) => (
            <option key={platform.name} value={platform.name}>{platform.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="adType" className="block text-sm font-medium text-gray-700">
          Ad Type
        </label>
        <select
          id="adType"
          value={selectedAdType}
          onChange={(e) => setSelectedAdType(e.target.value)}
          required
          disabled={!selectedPlatform}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select an ad type</option>
          {selectedPlatform && adTypes[selectedPlatform] && adTypes[selectedPlatform].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isLoading ? 'Adding...' : 'Add Campaign'}
      </button>
    </form>
  );
};

export default AddCampaignForm;