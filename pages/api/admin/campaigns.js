// pages/api/admin/campaigns.js -

import { getSession } from 'next-auth/react';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const client = await clientPromise;
  const db = client.db('adinput');

  const campaigns = await db.collection('adCampaigns').aggregate([
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
        companyName: '$company.name',
        platform: 1,
        adType: 1,
        status: 1
      }
    }
  ]).toArray();

  res.status(200).json(campaigns);
}

// pages/api/admin/generate-token.js

import { getSession } from 'next-auth/react';
import clientPromise from '../../../lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { campaignId } = req.body;
  const token = uuidv4();

  const client = await clientPromise;
  const db = client.db('adinput');

  await db.collection('tokens').insertOne({
    token,
    campaignId,
    status: 'active',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  });

  res.status(200).json({ token });
}