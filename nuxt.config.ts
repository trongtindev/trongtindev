// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },

  future: {
    compatibilityVersion: 4
  },

  nitro: {
    storage: {
      base: { driver: 'vercelKV' }
    },
    devStorage: {
      base: {
        driver: 'fs',
        base: './data/base'
      }
    }
  },

  runtimeConfig: {
    TZ: 'Asia/Ho_Chi_Minh',
    AUTH_TOKEN: '',
    GEMINI_KEY: '',
    GEMINI_MODEL: 'gemini-1.5-flash',
    GEMINI_OUTPUT_LENGTH: 1024,
    OPENAI_KEY: '',
    OPENAI_MODEL: 'gpt-4o-mini',
    OPENAI_ENDPOINT: '',
    OPENAI_OUTPUT_LENGTH: 1024,
    MONGODB_URI: '',
    MONGODB_NAME: 'trongtin',
    S3_KEY: '',
    S3_SECRET: '',
    S3_BUCKET: 'analysics',
    S3_REGION: 'sgp1',
    S3_ENDPOINT: 'https://sgp1.digitaloceanspaces.com',
    FIREBASE_KEY: ''
  },

  devServer: {
    port: 3000
  },

  modules: ['@nuxt/ui']
});
