import { getToken } from 'next-auth/jwt';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  const token = await getToken({ req });
  
  if (!token || token.userRole !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const client = await clientPromise;
  const db = client.db();

  const tokens = await db.collection('tokens').find().toArray();
  const adCounts = await getAdCounts(db, tokens);

  res.status(200).json({ adCounts });
}

async function getAdCounts(db, tokens) {
  const adCounts = {};
  for (const token of tokens) {
    const count = await db.collection('ads').countDocuments({ token: token._id });
    adCounts[token.token] = count;
  }
  return adCounts;
}
