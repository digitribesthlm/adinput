// pages/api/validate-token.js

import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('adinput');

  try {
    const tokenDoc = await db.collection('tokens').findOne({ token, status: 'active' });

    if (!tokenDoc) {
      return res.status(404).json({ message: 'Invalid or expired token' });
    }

    const campaign = await db.collection('adCampaigns').findOne({ _id: new ObjectId(tokenDoc.adCampaignId) });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const company = await db.collection('companies').findOne({ _id: new ObjectId(campaign.companyId) });

    res.status(200).json({
      campaign: {
        ...campaign,
        companyName: company ? company.name : 'Unknown Company'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while validating the token' });
  } finally {
    await client.close();
  }
}