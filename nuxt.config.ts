// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  $development: {
    typescript: {
      strict: true
    }
  },

  compatibilityDate: '2024-04-03',

  devtools: { enabled: false },

  future: {
    compatibilityVersion: 4
  },

  nitro: {
    preset: 'vercel',
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

    GOOGLE_KEY: {},
    VERTEXAI_PROJECT: 'zchat-80e24',
    VERTEXAI_LOCATION: 'asia-east2',
    VERTEXAI_GENERATIVE_MODEL: 'gemini-1.5-flash-002',
    VERTEXAI_GENERATIVE_MAX_OUTPUT_TOKENS: 1024,

    MONGODB_URI: '',
    MONGODB_NAME: 'trongtin',

    S3_KEY: '',
    S3_SECRET: '',
    S3_BUCKET: 'analysics',
    S3_REGION: 'sgp1',
    S3_ENDPOINT: 'https://sgp1.digitaloceanspaces.com'
  },

  devServer: {
    port: 3000
  },

  modules: ['@nuxt/ui']
});
