// pages/api/fetch-ad-constants.js - 

import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('adinput');

    const platforms = await db.collection('adPlatforms').find().toArray();
    const types = await db.collection('adTypes').find().toArray();
    const fields = await db.collection('adTypeFields').find().toArray();

    res.status(200).json({ platforms, types, fields });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ad constants' });
  }
}