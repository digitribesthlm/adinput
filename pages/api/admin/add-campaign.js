// pages/api/admin/add-campaign.js

import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { companyId, platform, adType, dueDate } = req.body;

  if (!companyId || !platform || !adType || !dueDate) {
    return res.status(400).json({ message: 'Missing required fields', body: req.body });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('adinput');

  try {
    const company = await db.collection('companies').findOne({ _id: new ObjectId(companyId) });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const newCampaign = {
      companyId: new ObjectId(companyId),
      platform,
      adType,
      status: 'not_started',
      createdAt: new Date(),
      updatedAt: new Date(),
      dueDate: new Date(dueDate),
      adCopy: {}
    };

    const result = await db.collection('adCampaigns').insertOne(newCampaign);

    const insertedCampaign = {
      ...newCampaign,
      _id: result.insertedId,
      companyName: company.name
    };

    res.status(201).json({ message: 'Campaign added successfully', campaign: insertedCampaign });
  } catch (error) {
    console.error('Error adding campaign:', error);
    res.status(500).json({ message: 'An error occurred while adding the campaign' });
  } finally {
    await client.close();
  }
}