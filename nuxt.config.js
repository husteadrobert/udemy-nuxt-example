const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: "Dumb Shit Project",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'My dumb shit project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: "https://fonts.googleapis.com/css?family=Open+Sans" }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },

  /*
  ** Global CSS
  */
  css: [
    '~assets/styles/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/core-components.js',
    '~plugins/date-filter.js'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios'
  ],
  axios: {
    baseURL: 'https://rh-blog-test-default-rtdb.asia-southeast1.firebasedatabase.app',
    credentials: false
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {

    }
  },
  env: {
    baseUrl: process.env.BASE_URL || 'https://rh-blog-test-default-rtdb.asia-southeast1.firebasedatabase.app',
    fbAPIKey: 'AIzaSyDnICjwkbP5BcHxvppZyZB8IFReQdDmvOY'
  },
  router: {
    middleware: 'log',
    extendRoutes(routes, resolve) {
      routes.push({
        path: '*',
        component: resolve(__dirname, 'pages/index.vue')
      })
    }
  },
  transition: {
    name: 'fade',
    mode: 'out-in'
  }
}
