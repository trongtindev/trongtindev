export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt',
    '@pinia/nuxt'
  ],

  $development: {},

  $production: {},

  css: ['assets/css/main.css'],

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
    },
    prerender: {
      routes: ['/'],
      crawlLinks: true
    }
  },

  compatibilityDate: '2024-08-15'
});
