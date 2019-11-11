<template>
  <no-ssr>
    <div>
      <div class="backdrop">
        <h3 class="backdrop_header">Shared News</h3>
        <img src="~/assets/feature_backdrop_v2.jpg" class="img-responsive w-100"/>
      </div>

      <featured-article-slider></featured-article-slider>
    </div>
  </no-ssr>
</template>

<script>
    import FeaturedArticleSlider from "../components/featured/featured-article-slider";

    export default {
        name: "recommendations",
        components: {
            FeaturedArticleSlider
        }
    };
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Open%20Sans');

  * {
    font-family: "Open Sans", serif;
  }

  .backdrop {
    position: relative;
  }

  .backdrop_header {
    position: absolute;
    left: 20%;
    top: 25%;
    z-index: 2;
    font-family: "Open Sans", serif;
    display: block;
    font-weight: 700;
    font-size: 100px;
    color: whitesmoke;
    letter-spacing: 1px;
    text-shadow: 2px 2px 5px black;
  }

  .backdrop img {
    width: 100%;
    z-index: 1;
  }

  @media only screen and (max-width: 4096px) {
    .backdrop_header {
      left: 25%;
      top: 25%;
      font-size: 90px;
    }
  }

  @media only screen and (max-width: 1000px) {
    .backdrop_header {
      left: 8%;
      top: 15%;
      font-size: 80px;
    }
  }


  @media only screen and (max-width: 700px) {
    .backdrop_header {
      left: 7%;
      top: 15%;
      font-size: 60px;
    }
  }

  @media only screen and (max-width: 600px) {
    .backdrop_header {
      left: 4%;
      top: 15%;
      font-size: 60px;
    }
  }

  @media only screen and (max-width: 450px) {
    .backdrop_header {
      left: 7%;
      top: 15%;
      font-size: 40px;
    }
  }
</style>
