import { MongoClient, ObjectId } from 'mongodb'; - 
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Missing token' });
  }

  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db(process.env.MONGODB_DB);

  try {
    const ads = await db.collection('ads').find({ token }).toArray();
    res.status(200).json({ ads });
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ message: 'An error occurred while fetching ads' });
  } finally {
    await client.close();
  }
}
