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
    OPENAI_KEY: '',
    OPENAI_ENDPOINT: ''
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
