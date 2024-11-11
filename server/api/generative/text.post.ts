import { IGenerativePrompt } from '~~/server/interfaces/generative';
import { GenerativeProvider } from '~~/server/utils/apiFactory';

export default defineEventHandler(async (event) => {
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

  // provider
  if (typeof body.provider != 'string') {
    throw createError({ status: 400 });
  }
  const provider: GenerativeProvider = body.provider;
  if (!['gemini', 'chatgpt'].includes(provider)) {
    throw createError({ status: 400 });
  }

  const generativeAPI = getGenerativeAPI(provider);
  const response = await generativeAPI.generateContent(prompts);

  return {
    content: response.trim()
  };
});
