// pages/api/admin/ad-counts.js

import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('adinput');

  try {
    const tokens = await db.collection('tokens').find().toArray();
    const adCounts = await getAdCounts(db, tokens);

    res.status(200).json({ adCounts });
  } catch (error) {
    console.error('An error occurred while fetching ad counts:', error);
    res.status(500).json({ message: 'An error occurred while fetching ad counts', error: error.message });
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
