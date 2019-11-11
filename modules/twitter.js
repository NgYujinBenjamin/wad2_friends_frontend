const Twitter = require('twitter')
const fs = require('fs-extra')

const client = new Twitter({
  consumer_key: 'KEY',
  consumer_secret: 'Secret',
  access_token_key: 'TOKEN',
  access_token_secret: 'Secret'
})

const endpoint = 'trends/place.json'
const params = {
  id: '1062617',
}
const callback = (error, tweets, response) => {
  if (!error) fs.outputJSON('./assets/trends.json', tweets)
}

client.get(endpoint, params, callback)

export default function NuxtTwitter(config) {
  this.nuxt.hook('build:before', generator => {
    client.get(endpoint, params, callback)
  })
}
