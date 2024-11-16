export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) throw createError({ status: 400, message: 'invalid_body' });

  const items: {
    userId: string;
    displayName: string;
    avatar: string;
    gender: number;
  }[] = body.items;
  if (typeof items != 'object' || !items) {
    throw createError({ status: 400, message: 'invalid_items' });
  }

  const validate = items.every((e) => {
    return (
      typeof e.userId == 'string' &&
      typeof e.displayName == 'string' &&
      typeof e.avatar == 'string' &&
      typeof e.gender == 'number'
    );
  });
  if (!validate) {
    throw createError({ status: 400, message: 'invalid_items' });
  }

  const db = await getDb();
  await db.collection('users').bulkWrite(
    items.map((e) => {
      return {
        updateOne: {
          filter: {
            userId: e.userId
          },
          update: {
            $set: {
              displayName: e.displayName,
              avatar: e.avatar,
              gender: e.gender,
              updatedAt: Date.now()
            }
          },
          upsert: true
        }
      };
    })
  );
});
