import type {
  GenerateContentRequest,
  GenerateContentResult,
  GenerationConfig
} from '@google-cloud/vertexai';
import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold
} from '@google-cloud/vertexai';

let client: VertexAI;
const ensureInitializeClient = () => {
  if (client) return;

  const { VERTEXAI_PROJECT, VERTEXAI_LOCATION, GOOGLE_KEY } =
    useRuntimeConfig();
  if (!VERTEXAI_PROJECT) throw new Error('VERTEXAI_PROJECT');
  if (!VERTEXAI_LOCATION) throw new Error('VERTEXAI_LOCATION');
  if (typeof GOOGLE_KEY != 'object') throw new Error('GOOGLE_KEY');

  client = new VertexAI({
    project: VERTEXAI_PROJECT,
    location: VERTEXAI_LOCATION,
    googleAuthOptions: { credentials: GOOGLE_KEY }
  });
};

export const generateContent = async (
  request: GenerateContentRequest | string,
  generationConfig?: GenerationConfig | undefined
) => {
  ensureInitializeClient();

  const logPrefix = `[utils/vertexai] generateContent()`;
  logger.debug(`${logPrefix}`, {
    request: JSON.stringify(request),
    generationConfig: JSON.stringify(generationConfig)
  });

  const { VERTEXAI_GENERATIVE_MODEL, VERTEXAI_GENERATIVE_MAX_OUTPUT_TOKENS } =
    useRuntimeConfig();
  if (!VERTEXAI_GENERATIVE_MODEL) throw new Error('VERTEXAI_GENERATIVE_MODEL');
  if (!VERTEXAI_GENERATIVE_MAX_OUTPUT_TOKENS)
    throw new Error('VERTEXAI_GENERATIVE_MAX_OUTPUT_TOKENS');

  generationConfig ??= {};
  generationConfig.responseMimeType = 'application/json';
  generationConfig.maxOutputTokens = VERTEXAI_GENERATIVE_MAX_OUTPUT_TOKENS;

  const model = client.getGenerativeModel({
    model: VERTEXAI_GENERATIVE_MODEL,
    generationConfig,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE
      }
    ]
  });

  const result: Result<GenerateContentResult> = await new Promise((resolve) => {
    model
      .generateContent(request)
      .then((result) => {
        resolve(Result.ok(result));
      })
      .catch((error) => {
        logger.error(`${logPrefix} ` + error.message);
        resolve(Result.err(error));
      });
  });

  if (result.isOk) {
    logger.debug(`${logPrefix} done` + result.value.response);
  }
  return result;
};
