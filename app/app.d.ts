import type { IAuth } from './server/interfaces/auth';

interface H3EventContext extends Record<string, any> {
  auth?: IAuth;
}
