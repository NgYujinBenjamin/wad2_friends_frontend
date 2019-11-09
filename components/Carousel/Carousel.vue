<template>
  <div>
    <b-carousel
      :interval="6000"
      fade
      controls
      indicators
      background="#ababab"
      img-width="1024"
      img-height="480"
      style="text-shadow: 1px 1px 2px #333;"
    >
      <!-- Text slides with image -->
      <b-carousel-slide
        class="image_sliders"
        v-for="(article,index) in carouselArticles"
        :key="index"
        :caption="article.title"
        :img-src="article.urlToImage"
        img-width="1024"
        img-height="480"
      ></b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
export default {
    data() {
            return {
                carouselArticles: {},
                myWidth:0,
                myHeight:0,
                carouselImages: {}
            };
        },
    methods: {
        async fetchData() {
            let url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=7b8d0f9048464a8fa74e3edf2c215b8d&pageSize=4&domains=channelnewsasia.com,Yahoo.com";
            const res = await this.$axios.$get(url);
            let to_append = [];
            console.log(res.articles);
            for (let article of res.articles){
              if (article.urlToImage != null){
                to_append.push(article);
                console.log(to_append);
              }
            }
            // this.carouselArticles = res.articles;
            this.carouselArticles = to_append;
        },
    },
    mounted: function () {
            this.fetchData()

            this.myWidth = document.documentElement.clientWidth;
            this.myHeight = document.documentElement.clientHeight;
            var imageSliders = document.getElementsByClassName("image_sliders");

            for (let imageSlider of imageSliders){
                imageSlider.style["height"] = this.myHeight ? this.myHeight : '800';
            }

        }
}
</script>

<style>
    .image_sliders{
        width: 100%;
        height: 1000px !important;
    }
</style>
