// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    'vuetify-nuxt-module',
    '@nuxtjs/tailwindcss',
   ],
  routeRules: {
    '/liveness': { ssr: false },     // página exacta
    '/form': { ssr: false },     // página exacta
    // '/liveness/**': { ssr: false } // todo un subárbol
  },
})