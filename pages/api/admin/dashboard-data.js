// pages/api/admin/dashboard-data.js

import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('adinput');

  try {
    const campaigns = await db.collection('adCampaigns').aggregate([
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
        $project: {
          _id: 1,
          companyId: '$companyId',
          companyName: { $ifNull: ['$company.name', 'Unknown Company'] },
          platform: 1,
          adType: 1,
          status: 1
        }
      }
    ]).toArray();

    const stats = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status !== 'completed').length,
      completedCampaigns: campaigns.filter(c => c.status === 'completed').length
    };

    res.status(200).json({ campaigns, stats });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'An error occurred while fetching dashboard data' });
  } finally {
    await client.close();
  }
}