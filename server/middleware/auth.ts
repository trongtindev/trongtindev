import jsonwebtoken from 'jsonwebtoken';
import { IAuth } from '../interfaces/auth';

export default defineEventHandler((event) => {
  const { AUTH_TOKEN } = useRuntimeConfig();

  const authorization = getRequestHeader(event, 'authorization');
  if (!authorization) throw createError({ status: 401 });

  try {
    event.context.auth = jsonwebtoken.verify(
      authorization.split(' ')[1],
      AUTH_TOKEN
    ) as IAuth;
    console.log('authorization', authorization, event.context.auth);
  } catch (error: any) {
    if (error.name == 'TokenExpiredError') {
      throw createError({ status: 401 });
    } else if (error.name == 'JsonWebTokenError') {
      throw createError({ status: 400 });
    }

    console.log(error);
    throw createError({ status: 500 });
  }
});
