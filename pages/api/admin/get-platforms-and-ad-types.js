// pages/api/admin/get-platforms-and-ad-types.js

import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('adinput');

  try {
    const platforms = await db.collection('adPlatforms').find().toArray();
    const adTypesResult = await db.collection('adTypes').find().toArray();
    const adTypeFields = await db.collection('adTypeFields').find().toArray();

    const adTypes = adTypesResult.reduce((acc, curr) => {
      if (!acc[curr.platform]) {
        acc[curr.platform] = [];
      }
      acc[curr.platform].push(curr.name);
      return acc;
    }, {});

    const formattedAdTypeFields = adTypeFields.reduce((acc, curr) => {
      if (!acc[curr.platform]) {
        acc[curr.platform] = {};
      }
      acc[curr.platform][curr.adType] = curr.fields;
      return acc;
    }, {});

    res.status(200).json({ platforms, adTypes, adTypeFields: formattedAdTypeFields });
  } catch (error) {
    console.error('Error fetching platforms and ad types:', error);
    res.status(500).json({ message: 'An error occurred while fetching platforms and ad types' });
  } finally {
    await client.close();
  }
}