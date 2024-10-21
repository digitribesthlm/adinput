// pages/api/admin/dashboard-data.js

import { getSession } from 'next-auth/react';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('adinput');

    // Fetch recent campaigns
    const campaigns = await db.collection('adCampaigns').aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company'
        }
      },
      { $unwind: '$company' },
      {
        $project: {
          _id: 1,
          companyName: '$company.name',
          platform: 1,
          adType: 1,
          status: 1
        }
      }
    ]).toArray();

    // Fetch stats
    const stats = await db.collection('adCampaigns').aggregate([
      {
        $group: {
          _id: null,
          totalCampaigns: { $sum: 1 },
          activeCampaigns: {
            $sum: {
              $cond: [{ $in: ['$status', ['not_started', 'in_progress']] }, 1, 0]
            }
          },
          completedCampaigns: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          }
        }
      }
    ]).toArray();

    res.status(200).json({
      campaigns,
      stats: stats[0] || { totalCampaigns: 0, activeCampaigns: 0, completedCampaigns: 0 }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}