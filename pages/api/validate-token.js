// pages/api/validate-token.js

import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { token } = req.query;

  console.log('Token received:', token); // Step 1: Log the received token

  if (!token) {
    console.log('Token is missing'); // Step 2: Log if token is missing
    return res.status(400).json({ message: 'Token is required' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB'); // Step 3: Log successful connection

  const db = client.db('adinput');

  try {
    console.log('Finding token in database...'); // Step 4: Log before finding the token

    const tokenDoc = await db.collection('tokens').findOne({ token, status: 'active' });

    console.log('Token found:', tokenDoc); // Step 5: Log the found token document

    if (!tokenDoc) {
      console.log('Token not found or invalid'); // Step 6: Log if token is not found
      return res.status(404).json({ message: 'Invalid or expired token' });
    }

    console.log('Finding campaign...'); // Step 7: Log before finding the campaign

    const campaign = await db.collection('adCampaigns').findOne({ _id: new ObjectId(tokenDoc.adCampaignId) });

    console.log('Campaign found:', campaign); // Step 8: Log the found campaign

    if (!campaign) {
      console.log('Campaign not found'); // Step 9: Log if campaign is not found
      return res.status(404).json({ message: 'Campaign not found' });
    }

    console.log('Finding company...'); // Step 10: Log before finding the company

    const company = await db.collection('companies').findOne({ _id: new ObjectId(campaign.companyId) });

    console.log('Company found:', company); // Step 11: Log the found company

    res.status(200).json({
      campaign: {
        ...campaign,
        companyName: company ? company.name : 'Unknown Company'
      }
    });
  } catch (error) {
    console.error('Error during token validation:', error); // Step 12: Log any errors
    res.status(500).json({ message: 'An error occurred while validating the token' });
  } finally {
    console.log('Closing MongoDB connection'); // Step 13: Log before closing the connection
    await client.close();
  }
}