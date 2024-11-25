import { IAuth } from '~~/server/interfaces/auth';
import admin from 'firebase-admin';
import { UserRecord } from 'firebase-admin/auth';

if (admin.apps.length == 0) {
  const FIREBASE_KEY = useRuntimeConfig().FIREBASE_KEY;
  const credential =
    typeof FIREBASE_KEY == 'string' ? JSON.parse(FIREBASE_KEY) : FIREBASE_KEY;

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: credential.project_id,
      privateKey: credential.private_key,
      clientEmail: credential.client_email
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
