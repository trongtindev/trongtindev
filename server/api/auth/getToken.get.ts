import type { IAuth } from '~~/server/interfaces/auth';
import admin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/auth';

if (admin.apps.length == 0) {
  const GOOGLE_KEY = useRuntimeConfig().GOOGLE_KEY;
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: GOOGLE_KEY.project_id,
      privateKey: GOOGLE_KEY.private_key,
      clientEmail: GOOGLE_KEY.client_email
    })
  });
}

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as IAuth;
  let user: UserRecord;
  try {
    user = await admin.auth().getUser(auth.userId);
  } catch (error) {
    user = await admin.auth().createUser({
      uid: auth.userId
    });
  }

  const token = await admin.auth().createCustomToken(auth.userId);
  return { token };
});
