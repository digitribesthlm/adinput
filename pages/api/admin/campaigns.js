
import { getSession } from 'next-auth/react';
import clientPromise from '../../../lib/mongodb';

export default async function campaignsHandler(req, res) {
  const session = await getSession({ req });

  if (!session || session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

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
