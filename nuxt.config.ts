const devUrl = 'http://localhost:3000';
const prodUrl = 'https://trongtin.dev';

export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt',
    '@pinia/nuxt',
  ],

  $development: {
    site: {
      url: devUrl,
    },
  },

  $production: {
    site: {
      url: prodUrl,
    },
  },

  css: ['assets/css/main.css'],

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },

  compatibilityDate: '2024-08-15',
});
