import { GenerativeProvider } from '~~/server/utils/apiFactory';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) throw createError({ status: 400 });

  if (typeof body.prompt != 'string') {
    throw createError({ status: 400 });
  }
  const prompt: string = body.prompt;
  if (prompt.length > 512) throw createError({ status: 400 });

  if (typeof body.provider != 'string') {
    throw createError({ status: 400 });
  }
  const provider: GenerativeProvider = body.provider;
  if (!['gemini', 'chatgpt'].includes(provider)) {
    throw createError({ status: 400 });
  }

  const generativeAPI = getGenerativeAPI(provider);
  const response = await generativeAPI.generateContent(prompt);

  return response.replaceAll('```json', '').replaceAll('```', '').trim();
});
