// pages/api/admin/get-companies.js - 

import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('adinput');

  try {
    const companies = await db.collection('companies').find({}).project({ _id: 1, name: 1 }).toArray();
    res.status(200).json({ companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ message: 'An error occurred while fetching companies' });
  } finally {
    await client.close();
  }
}