// /pages/api/save-ad.js
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { campaignId, platform, adType, adCopy, createdAt } = req.body;

  if (!campaignId || !platform || !adType || !adCopy) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('adinput');

  try {
    // Log input data for debugging purposes
    console.log('Saving Ad with data:', { campaignId, platform, adType, adCopy, createdAt });

    const result = await db.collection('ads').insertOne({
      campaignId: new ObjectId(campaignId),
      platform,
      adType,
      adCopy,
      createdAt: createdAt || new Date()
    });

    if (!result.acknowledged) {
      console.error('Insert failed:', result);
      return res.status(500).json({ message: 'Failed to save ad' });
    }

    res.status(200).json({ message: 'Ad saved successfully' });
  } catch (error) {
    console.error('An error occurred while saving the ad:', error);
    res.status(500).json({ message: 'An error occurred while saving the ad' });
  } finally {
    await client.close();
  }
}
