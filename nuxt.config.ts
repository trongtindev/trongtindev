// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4
  },
  nitro: {},
  runtimeConfig: {
    GEMINI_KEY: '',
    GEMINI_MODEL: 'gemini-1.5-flash',
    GEMINI_OUTPUT_LENGTH: 1024,
    OPENAI_KEY: '',
    OPENAI_MODEL: 'gpt-4o-mini',
    OPENAI_ENDPOINT: '',
    OPENAI_OUTPUT_LENGTH: 1024
  },
  vue: {},
  vite: {
    build: {},
    server: {
      warmup: {}
    }
  },
  devServer: {
    port: 3000
  }
});
