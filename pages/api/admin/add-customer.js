// pages/api/admin/add-customer.js -

import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, contactPhone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_DB);

  try {
    const result = await db.collection('companies').insertOne({
      name,
      contactEmail: email,
      contactPhone,
      createdAt: new Date(),
    });

    const newCustomer = {
      _id: result.insertedId,
      name,
      contactEmail: email,
      contactPhone,
    };

    res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ message: 'An error occurred while adding the customer' });
  } finally {
    await client.close();
  }
}