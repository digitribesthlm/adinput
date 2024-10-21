// /pages/api/ad-data.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db('adinput');

  try {
    const platforms = await db.collection('adPlatforms').find().toArray();
    const types = await db.collection('adTypes').find().toArray();
    const fields = await db.collection('adTypeFields').find().toArray();

    const formattedPlatforms = {};
    const formattedTypes = {};
    const formattedFields = {};

    platforms.forEach(platform => {
      formattedPlatforms[platform.name] = platform.displayName;
    });

    types.forEach(type => {
      if (!formattedTypes[type.platform]) {
        formattedTypes[type.platform] = {};
      }
      formattedTypes[type.platform][type.name] = type.displayName;
    });

    fields.forEach(field => {
      if (!formattedFields[field.platform]) {
        formattedFields[field.platform] = {};
      }
      if (!formattedFields[field.platform][field.adType]) {
        formattedFields[field.platform][field.adType] = {};
      }
      field.fields.forEach(subField => {
        formattedFields[field.platform][field.adType][subField.name] = {
          charLimit: subField.charLimit,
          min: subField.min,
          max: subField.max,
          optional: subField.optional || false
        };
      });
    });

    res.status(200).json({
      platforms: formattedPlatforms,
      types: formattedTypes,
      fields: formattedFields
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching ad data' });
  } finally {
    await client.close();
  }
}
