import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export type GenerativeProvider = 'gemini' | 'chatgpt';

export class GenerativeAPI {
  constructor() {}

  async generateContent(prompt: string): Promise<string> {
    throw new Error('NotImplemented');
  }
}

export class GenerativeGeminiAPI implements GenerativeAPI {
  private api: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor() {
    const { GEMINI_KEY } = useRuntimeConfig();
    this.api = new GoogleGenerativeAI(GEMINI_KEY);
    this.model = this.api.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateContent(prompt: string): Promise<string> {
    const result = await this.model.generateContent([prompt]);
    return result.response.text();
  }
}

export class GenerativeOpenAIAPI implements GenerativeAPI {
  private client: OpenAI;

  constructor() {
    const { OPENAI_KEY } = useRuntimeConfig();
    this.client = new OpenAI({
      apiKey: OPENAI_KEY,
      baseURL: 'https://open.keyai.shop/v1'
    });
  }

  async generateContent(prompt: string): Promise<string> {
    const result = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo'
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
