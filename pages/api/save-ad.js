// pages/api/save-ad.js

import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { campaignId, platform, adType, adCopy } = req.body;

  if (!campaignId || !platform || !adType || !adCopy) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('adinput');

  try {
    const result = await db.collection('adCampaigns').updateOne(
      { _id: new ObjectId(campaignId) },
      { 
        $set: { 
          platform,
          adType,
          adCopy,
          status: 'completed',
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Campaign not found or not updated' });
    }

    res.status(200).json({ message: 'Ad saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while saving the ad' });
  } finally {
    await client.close();
  }
}