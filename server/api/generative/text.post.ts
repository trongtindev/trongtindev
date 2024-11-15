import { IAuth } from '~~/server/interfaces/auth';
import { IGenerativePrompt } from '~~/server/interfaces/generative';
import { GenerativeProvider } from '~~/server/utils/apiFactory';

interface IUsage {
  count: number;
  day: number;
}

export default defineEventHandler(async (event) => {
  const storage = useStorage('base');

  // check rate limit
  const auth: IAuth = event.context.auth;
  if (!auth) throw createError({ status: 401 });
  if (!auth.package || typeof auth.package.aiGenCount != 'number') {
    throw createError({ status: 400, message: 'invalid_aiGenCount' });
  }
  const day = new Date().getDate();
  const rateLimitKey = `aiGenCount-${auth.userId}`;
  let usage = await storage.getItem<IUsage>(rateLimitKey);
  if (!usage) usage = { count: 0, day };
  if (usage.day != day) usage = { count: 0, day };
  if (usage.count >= auth.package.aiGenCount) {
    throw createError({ status: 429, message: 'rate limit exceeded' });
  }

  usage.count += 1;
  setResponseHeader(event, 'RateLimit-Limit', auth.package.aiGenCount);
  setResponseHeader(
    event,
    'RateLimit-Remaining',
    auth.package.aiGenCount - usage.count
  );

  const body = await readBody(event);
  if (!body) throw createError({ status: 400, message: 'invalid_body' });

  // prompts
  if (typeof body.prompts == 'undefined') {
    throw createError({ status: 400, message: 'invalid_prompts' });
  }
  const prompts: IGenerativePrompt[] = body.prompts;
  if (typeof prompts != 'object') {
    throw createError({ status: 400, message: 'invalid_prompts' });
  }
  if (prompts.length == 0 || prompts.length > 10) {
    throw createError({ status: 400, message: 'invalid_length' });
  }

  // schema
  if (typeof body.schema == 'undefined') {
    throw createError({ status: 400, message: 'schema' });
  }
  const schema: Record<string, unknown> = body.schema;

  // provider
  if (typeof body.provider != 'string') {
    throw createError({ status: 400 });
  }
  const provider: GenerativeProvider = body.provider;
  if (!['gemini', 'chatgpt'].includes(provider)) {
    throw createError({ status: 400 });
  }

  const generativeAPI = getGenerativeAPI(provider);
  const response = await generativeAPI.generateContent(prompts, schema);

  // update rate limit
  await storage.setItem(rateLimitKey, usage);

  return { content: response.trim() };
});
