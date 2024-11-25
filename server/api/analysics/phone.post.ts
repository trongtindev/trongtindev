export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) throw createError({ status: 400, message: 'invalid_body' });

  const items: { userId: string; phoneNumber: string }[] = body.items;
  if (typeof items != 'object' || !items) {
    throw createError({ status: 400, message: 'invalid_items' });
  }

  const validate = items.every((e) => {
    return typeof e.phoneNumber == 'string' && typeof e.userId == 'string';
  });
  if (!validate) {
    throw createError({ status: 400, message: 'invalid_items' });
  }

  const db = await getDb();
  await db.collection('phone_commits').bulkWrite(
    items.map((e) => {
      return {
        insertOne: {
          document: {
            userId: e.userId,
            phoneNumber: e.phoneNumber,
            createdAt: new Date()
          }
        }
      };
    })
  );
});
