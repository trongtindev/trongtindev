import type { IPlan } from '~~/server/interfaces/auth';
import type { IGenerativePrompt } from '~~/server/interfaces/generative';

interface IUsage {
  count: number;
  day: number;
}

export default defineEventHandler(async (event) => {
  const storage = useStorage('base');

  // check rate limit
  const plan: IPlan = event.context.plan;
  if (!plan) throw createError({ status: 401 });
  if (!plan.package || typeof plan.package.aiGenCount != 'number') {
    throw createError({ status: 400, message: 'invalid_aiGenCount' });
  }
  const day = new Date().getDate();
  const rateLimitKey = `aiGenCount-${plan.userId}`;
  let usage = await storage.getItem<IUsage>(rateLimitKey);
  if (!usage) usage = { count: 0, day };
  if (usage.day != day) usage = { count: 0, day };
  if (usage.count >= plan.package.aiGenCount) {
    throw createError({ status: 429, message: 'rate limit exceeded' });
  }

  usage.count += 1;
  setResponseHeader(event, 'RateLimit-Limit', plan.package.aiGenCount);
  setResponseHeader(
    event,
    'RateLimit-Remaining',
    plan.package.aiGenCount - usage.count
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
  const result = await generateContent(
    {
      contents: prompts.map((e) => {
        return {
          role: e.role,
          parts: [
            {
              text: e.content
            }
          ]
        };
      })
    },
    {
      responseSchema: schema
    }
  );
  if (result.isError) {
    throw createError({ status: 500, message: result.error.message });
  }

  const candidates = result.value.response.candidates;
  if (!candidates) {
    throw createError({ status: 500, message: 'invalid_candidates' });
  }
  return { content: candidates[0].content.parts[0].text };
});
