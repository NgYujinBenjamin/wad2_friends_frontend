const Twitter = require('twitter')
const fs = require('fs-extra')

const client = new Twitter({
  consumer_key: 'WTS3meCTV0yuYVDGjXIO2Niaa',
  consumer_secret: '2ieA0TVp6QU5aFE6gxldRPITwMtQ08q3JDagcSL8kP3CI9nYyE',
  access_token_key: '1168783151339933697-xgbQiWUTEZZ76k85aNNHaaYdGknuzl',
  access_token_secret: 'WiaLIwJfFTGl7se6lpQyzIfLLiaS0rT2EmhivaIcgeWBe'
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
