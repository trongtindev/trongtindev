import jsonwebtoken from 'jsonwebtoken';
import { IAuth } from '../interfaces/auth';

export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api')) return;

  const authorization = getRequestHeader(event, 'authorization');
  if (!authorization) throw createError({ status: 401 });

  const planToken = getRequestHeader(event, 'plan');
  if (!planToken) throw createError({ status: 401, message: 'invalid_plan' });

  const { AUTH_TOKEN } = useRuntimeConfig();

  const auth: IAuth = jsonwebtoken.verify(
    authorization.split(' ')[1],
    AUTH_TOKEN
  ) as IAuth;
  const plan: IAuth = jsonwebtoken.verify(planToken, AUTH_TOKEN) as IAuth;

  console.warn('expires', auth.expires - Date.now() / 1000);
  if (auth.tokenType != 'bearer') {
    throw createError({ status: 401, message: 'invalid_type' });
  }
  if (Date.now() / 1000 > auth.expires) {
    throw createError({ status: 401, message: 'expires' });
  }

  event.context.auth = auth;
  event.context.plan = plan;
});
