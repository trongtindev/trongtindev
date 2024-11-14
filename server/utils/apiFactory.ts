import {
  GenerativeModel,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory
} from '@google/generative-ai';
import OpenAI from 'openai';
import { IGenerativePrompt } from '../interfaces/generative';

export type GenerativeProvider = 'gemini' | 'chatgpt';

export class GenerativeAPI {
  constructor() {}

  async generateContent(
    prompts: IGenerativePrompt[],
    json_schema: Record<string, unknown>
  ): Promise<string> {
    throw new Error('NotImplemented');
  }
}

export class GenerativeGeminiAPI implements GenerativeAPI {
  private api: GoogleGenerativeAI;

  constructor() {
    const { GEMINI_KEY } = useRuntimeConfig();
    this.api = new GoogleGenerativeAI(GEMINI_KEY);
  }

  async generateContent(
    prompts: IGenerativePrompt[],
    schema: Record<string, unknown>
  ): Promise<string> {
    const { GEMINI_MODEL, GEMINI_OUTPUT_LENGTH } = useRuntimeConfig();

    const model = this.api.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: GEMINI_OUTPUT_LENGTH,
        responseSchema: schema
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE
        }
      ]
    });
    const result = await model.generateContent(prompts.map((e) => e.content));
    return result.response.text();
  }
}

export class GenerativeOpenAIAPI implements GenerativeAPI {
  private client: OpenAI;

  constructor() {
    const { OPENAI_KEY, OPENAI_ENDPOINT } = useRuntimeConfig();
    this.client = new OpenAI({
      apiKey: OPENAI_KEY,
      baseURL: OPENAI_ENDPOINT ?? null
    });
  }

  async generateContent(
    prompts: IGenerativePrompt[],
    schema: Record<string, unknown>
  ): Promise<string> {
    const { OPENAI_MODEL, OPENAI_OUTPUT_LENGTH } = useRuntimeConfig();
    const result = await this.client.chat.completions.create({
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'response',
          schema
        }
      },
      messages: prompts,
      model: OPENAI_MODEL,
      max_tokens: OPENAI_OUTPUT_LENGTH,
      max_completion_tokens: OPENAI_OUTPUT_LENGTH
    });

    return result.choices[0].message.content!;
  }
}

export const getGenerativeAPI = (provider: GenerativeProvider) => {
  if (provider == 'gemini') {
    return new GenerativeGeminiAPI();
  } else if (provider == 'chatgpt') {
    return new GenerativeOpenAIAPI();
  }
  throw new Error('NotImplemented');
};
