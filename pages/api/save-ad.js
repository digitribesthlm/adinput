// /pages/api/save-ad.js
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { campaignId, platform, adType, adCopy, createdAt, token } = req.body;

  if (!campaignId || !platform || !adType || !adCopy) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_DB);

  try {
    // Normalize adCopy data
    const normalizedAdCopy = {};
    for (const field in adCopy) {
      if (Array.isArray(adCopy[field])) {
        normalizedAdCopy[field] = adCopy[field][0] || '';
      } else {
        normalizedAdCopy[field] = adCopy[field];
      }
    }

    const result = await db.collection('ads').insertOne({
      campaignId: new ObjectId(campaignId),
      platform,
      adType,
      adCopy: normalizedAdCopy,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      token
    });

    if (!result.acknowledged) {
      console.error('Insert failed:', result);
      return res.status(500).json({ message: 'Failed to save ad' });
    }

    res.status(200).json({ message: 'Ad saved successfully' });
  } catch (error) {
    console.error('An error occurred while saving the ad:', error);
    res.status(500).json({ message: 'An error occurred while saving the ad', error: error.message });
  } finally {
    await client.close();
  }
}
