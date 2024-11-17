export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) throw createError({ status: 400, message: 'invalid_body' });

  const items: {
    userId: string;
    displayName: string;
    zaloName: string;
    avatar: string;
    gender: number;
    phoneNumber?: string;
    sdob?: string;
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
  await db.collection('profile_commits').bulkWrite(
    items.map((e) => {
      return {
        insertOne: {
          document: {
            userId: e.userId,
            displayName: e.displayName,
            avatar: e.avatar,
            zaloName: e.zaloName,
            gender: e.gender,
            phoneNumber: e.phoneNumber,
            sdob: e.sdob,
            createdAt: Date.now()
          }
        }
      };
    })
  );
});
