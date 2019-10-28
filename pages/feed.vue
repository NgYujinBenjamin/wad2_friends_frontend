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
        }
    }
</script>

<style scoped>
  .feed-card {
    margin-bottom: 10px;
  }
</style>
