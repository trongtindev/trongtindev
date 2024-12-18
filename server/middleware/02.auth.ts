import jsonwebtoken from 'jsonwebtoken';
import type { IAuth } from '../interfaces/auth';

export default defineEventHandler((event) => {
  const ignore = [/analysics\/phone/, /analysics\/profiles/].find((e) =>
    e.exec(event.path)
  );
  if (!event.path.startsWith('/api') || ignore) return;

  const { AUTH_TOKEN } = useRuntimeConfig();
  const authorization = getRequestHeader(event, 'authorization');
  if (!authorization) throw createError({ status: 401 });

  const auth: IAuth = jsonwebtoken.verify(
    authorization.split(' ')[1],
    AUTH_TOKEN
  ) as IAuth;

  if (auth.tokenType != 'bearer') {
    throw createError({ status: 401, message: 'invalid_type' });
  }
  if (Date.now() / 1000 > auth.expires) {
    throw createError({ status: 401, message: 'expires' });
  }
  event.context.auth = auth;

  if (!event.path.startsWith('/api/auth')) {
    const planToken = getRequestHeader(event, 'plan');
    if (!planToken) throw createError({ status: 401, message: 'invalid_plan' });
    const plan: IAuth = jsonwebtoken.verify(planToken, AUTH_TOKEN) as IAuth;
    event.context.plan = plan;
  }
});
