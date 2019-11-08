<template>
  <div>
    <b-carousel
      id="carousel-1"
      :interval="4000"
      controls
      indicators
      background="#ababab"
      img-width="1024"
      img-height="480"
      style="text-shadow: 1px 1px 2px #333;"
    >
      <!-- Text slides with image -->
      <b-carousel-slide
        v-for="(article,index) in carouselArticles"
        :key="index"
        :caption="article.Title"
        :text="article.description"
        :img-src="article.urlToImage"
      ></b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
export default {
    data() {
            return {
                carouselArticles: {}
            };
        },
    methods: {
        async fetchData() {
            let url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=7b8d0f9048464a8fa74e3edf2c215b8d&pageSize=3&domains=channelnewsasia.com,Yahoo.com";
            const res = await this.$axios.$get(url);
            this.carouselArticles = res.articles;
        }
    },
    mounted: function () {
            this.fetchData()
        }
}
</script>

<style>
    .carousel-inner img {
        margin: auto;
    }
</style>
