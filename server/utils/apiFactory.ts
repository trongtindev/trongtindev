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

  async generateContent(prompts: IGenerativePrompt[]): Promise<string> {
    throw new Error('NotImplemented');
  }
}

export class GenerativeGeminiAPI implements GenerativeAPI {
  private api: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    const { GEMINI_KEY, GEMINI_MODEL } = useRuntimeConfig();
    this.api = new GoogleGenerativeAI(GEMINI_KEY);
    this.model = this.api.getGenerativeModel({
      model: GEMINI_MODEL,
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
  }

  async generateContent(prompts: IGenerativePrompt[]): Promise<string> {
    const result = await this.model.generateContent(
      prompts.map((e) => e.content)
    );
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

  async generateContent(prompts: IGenerativePrompt[]): Promise<string> {
    const { OPENAI_MODEL } = useRuntimeConfig();
    const result = await this.client.chat.completions.create({
      messages: prompts,
      model: OPENAI_MODEL
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
