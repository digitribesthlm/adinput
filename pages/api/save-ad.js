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
    // Normalize adCopy data while preserving arrays
    const normalizedAdCopy = {};
    for (const field in adCopy) {
      if (Array.isArray(adCopy[field])) {
        // Filter out empty strings and preserve all non-empty values
        normalizedAdCopy[field] = adCopy[field].filter(item => item && item.trim() !== '');
        
        // If the field shouldn't be an array in the final structure, join the values
        if (['finalUrl', 'businessName', 'imageUrl', 'logoUrl', 'videoUrl', 'callToAction'].includes(field)) {
          normalizedAdCopy[field] = normalizedAdCopy[field][0] || '';
        }
      } else {
        // Handle non-array fields
        normalizedAdCopy[field] = adCopy[field] || '';
      }
    }

    // Restructure specific fields if needed
    const finalAdCopy = {
      finalUrl: normalizedAdCopy.finalUrl || '',
      headline: Array.isArray(normalizedAdCopy.headline) 
        ? normalizedAdCopy.headline 
        : [normalizedAdCopy.headline].filter(Boolean),
      longHeadline: Array.isArray(normalizedAdCopy.longHeadline)
        ? normalizedAdCopy.longHeadline
        : [normalizedAdCopy.longHeadline].filter(Boolean),
      description: Array.isArray(normalizedAdCopy.description)
        ? normalizedAdCopy.description
        : [normalizedAdCopy.description].filter(Boolean),
      callToAction: normalizedAdCopy.callToAction || '',
      businessName: normalizedAdCopy.businessName || '',
      imageUrl: normalizedAdCopy.imageUrl || '',
      logoUrl: normalizedAdCopy.logoUrl || '',
      videoUrl: normalizedAdCopy.videoUrl || ''
    };

    const result = await db.collection('ads').insertOne({
      campaignId: new ObjectId(campaignId),
      platform,
      adType,
      adCopy: finalAdCopy,
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