<template>
  <no-ssr>
    <masonry
      :cols="4"
      :gutter="30"
    >
      <div v-for="(article, index) in articles" :key="index">
        <b-card class="feed-card" :img-src="article.urlToImage" img-alt="Card image" img-top :title="article.title">
          <b-card-text v-text="article.description">
          </b-card-text>
          <b-button @click="translate(article.description)">Translate Test</b-button>
        </b-card>
      </div>
    </masonry>
  </no-ssr>
</template>

<script>
    export default {
        name: "feed",
        components: {},
        data() {
            return {
                articles: []
            }
        },
        async asyncData({$axios}) {
            const articles = await $axios.$get('https://newsapi.org/v2/top-headlines?country=sg&apiKey=7b8d0f9048464a8fa74e3edf2c215b8d').then(res => res.articles)
            return {articles}
        },
        methods: {
            translate: function (description) {
                console.log(description)
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': 'd9e003958b7244daa92f6cd96ce39cdb'
                    }
                }

                let url = `https://api-apc.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=de`;
                this.$axios.post(url,
                    [
                        {"text": description}
                    ], config
                ).then(response => {
                        let translated = response.data[0]['translations']
                        alert(JSON.stringify(translated))
                    }
                ).catch(e => {
                    console.log(e)
                })
            }
        }
    }
</script>

<style scoped>
  .feed-card {
    margin-bottom: 10px;
  }
</style>
