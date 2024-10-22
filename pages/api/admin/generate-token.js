// pages/api/admin/generate-token.js - 

import { MongoClient, ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { campaignId } = req.body;

  if (!campaignId) {
    return res.status(400).json({ message: 'Campaign ID is required' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('adinput');

  try {
    const campaign = await db.collection('adCampaigns').findOne({ _id: new ObjectId(campaignId) });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const token = uuidv4();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7); // Token valid for 7 days

    const newToken = {
      token,
      companyId: campaign.companyId, // Assuming the campaign has a companyId field
      adCampaignId: new ObjectId(campaignId),
      status: 'active',
      createdAt: new Date(),
      expiresAt: expirationDate
    };

    await db.collection('tokens').insertOne(newToken);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ message: 'An error occurred while generating the token' });
  } finally {
    await client.close();
  }
}