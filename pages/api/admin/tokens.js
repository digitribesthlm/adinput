// pages/api/admin/tokens.js - 

import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('adinput');

  try {
    const tokens = await db.collection('tokens').aggregate([
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company'
        }
      },
      {
        $unwind: {
          path: '$company',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'adCampaigns',
          localField: 'adCampaignId',
          foreignField: '_id',
          as: 'campaign'
        }
      },
      {
        $unwind: {
          path: '$campaign',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          token: 1,
          companyId: 1,
          companyName: { $ifNull: ['$company.name', 'Unknown Company'] },
          campaignType: { 
            $concat: [
              { $ifNull: ['$campaign.platform', 'Unknown'] },
              ' - ',
              { $ifNull: ['$campaign.adType', 'Unknown'] }
            ]
          },
          status: 1,
          createdAt: 1,
          expiresAt: 1
        }
      }
    ]).toArray();

    const adCounts = await getAdCounts(db, tokens);
    res.status(200).json({ tokens: tokens, adCounts: adCounts });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({ message: 'An error occurred while fetching tokens' });
  } finally {
    await client.close();
  }
}

async function getAdCounts(db, tokens) {
  const adCounts = {};
  for (const token of tokens) {
    console.log('Token ID:', token._id);
    console.log('Token:', token.token);
    const count = await db.collection('ads').countDocuments({ token: token.token });
    console.log('Ad Count:', count);
    adCounts[token.token] = count;
  }
  console.log('Ad Counts:', adCounts);
  return adCounts;
}
