export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#fff'},
  /*
  ** Global CSS
  */
  css: [],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '~/plugins/vue-masonry-css', ssr: false}
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    '@nuxtjs/proxy'
  ],

  toast: {
    position: 'bottom-right',
    duration: 3000,
    keepOnHover: true,
    iconPack: 'fontawesome',
    width: '300'

  },

  env: {
    baseUrl: 'https://sa-api.eof.cx' || 'http://localhost:3000'
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
  axios: {
    proxy: true, // Can be also an object with default options,
    proxyHeaders: true,
  },
  proxy: {
    '/twitter-api/': {
      target: 'https://api.twitter.com',
      pathRewrite: {'^/twitter-api/': ''},
      changeOrigin: true
    },
    '/fb-api/': {target: 'https://graph.facebook.com', pathRewrite: {'^/fb-api/': ''}}
  }


}
