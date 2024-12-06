import type { Db } from 'mongodb';
import { MongoClient } from 'mongodb';
import assert from 'assert';

let db: Db;

export const getDb = async (): Promise<Db> => {
  if (db) return db;

  const { MONGODB_URI, MONGODB_NAME } = useRuntimeConfig();
  assert(MONGODB_URI);
  assert(MONGODB_NAME);

  const client = new MongoClient(MONGODB_URI, { maxIdleTimeMS: 60 * 5 * 1000 });
  await client.connect();
  return client.db(MONGODB_NAME);
};
