import { MongoClient } from 'mongodb';
import assert from 'assert';

let client: MongoClient;

export const getDb = async () => {
  if (client) return;

  const { MONGODB_URI, MONGODB_NAME } = useRuntimeConfig();
  assert(MONGODB_URI);
  assert(MONGODB_NAME);

  client = new MongoClient(MONGODB_URI, { maxIdleTimeMS: 60 * 5 * 1000 });
  await client.connect();
  return client.db(MONGODB_NAME);
};
