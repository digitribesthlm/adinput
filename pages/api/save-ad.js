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
    // Normalize adCopy data
    const normalizedAdCopy = {
      headline: adCopy.headline,
      description: adCopy.description,
      finalUrl: adCopy.finalUrl[0] || '',
      callToAction: adCopy.callToAction[0] || '',
      businessName: adCopy.businessName[0] || '',
      imageUrl: adCopy.imageUrl[0] || '',
      logoUrl: adCopy.logoUrl[0] || '',
      videoUrl: adCopy.videoUrl || []
    };

    const result = await db.collection('ads').insertOne({
      campaignId: new ObjectId(campaignId),
      platform,
      adType,
      adCopy: normalizedAdCopy,
      createdAt: createdAt ? new Date(createdAt) : new Date()
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