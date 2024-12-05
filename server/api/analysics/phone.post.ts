export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) throw createError({ status: 400, message: 'invalid_body' });

  const items: { userId: string; phoneNumber: string }[] = body.items;
  if (!items || !Array.isArray(items) || items.length == 0) {
    console.log(body);
    throw createError({ status: 400, message: 'invalid_items1' });
  }

  const validate = items.find((e) => {
    return typeof e.phoneNumber != 'string' || typeof e.userId != 'string';
  });
  if (!validate) {
    console.log(body, { validate });
    throw createError({ status: 400, message: 'invalid_items2' });
  }

  const db = await getDb();
  await db.collection('phone_commits').bulkWrite(
    items.map((e) => {
      return {
        insertOne: {
          document: {
            ...e,
            userId: e.userId,
            phoneNumber: e.phoneNumber,
            createdAt: new Date()
          }
        }
      };
    })
  );
});
