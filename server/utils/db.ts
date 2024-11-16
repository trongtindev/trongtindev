import { MongoClient } from 'mongodb';
import assert from 'assert';
export const getDb = async () => {
  const { MONGODB_URI, MONGODB_NAME } = useRuntimeConfig();

  assert(MONGODB_URI);
  assert(MONGODB_NAME);

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client.db(MONGODB_NAME);
};
