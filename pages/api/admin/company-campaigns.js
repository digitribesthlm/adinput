// pages/api/admin/company-campaigns.js

import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Company ID is required' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('adinput');

  try {
    const company = await db.collection('companies').findOne({ _id: new ObjectId(id) });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const campaigns = await db.collection('adCampaigns').find({ companyId: new ObjectId(id) }).toArray();

    res.status(200).json({ company, campaigns });
  } catch (error) {
    console.error('Error fetching company campaigns:', error);
    res.status(500).json({ message: 'An error occurred while fetching company campaigns' });
  } finally {
    await client.close();
  }
}