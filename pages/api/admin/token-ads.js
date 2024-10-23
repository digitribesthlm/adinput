// pages/api/admin/token-ads.js

import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Missing token' });
  }

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const ads = await db.collection('ads').find({ token }).toArray();
    res.status(200).json({ ads });
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ message: 'An error occurred while fetching ads' });
  }
}
