<template>
  <no-ssr>
    <div>
      <div class="backdrop">
        <h3 class="backdrop_header">Featured News</h3>
        <img src="~/assets/feature_backdrop_v2.jpg" class="img-responsive w-100"/>
      </div>

      <shared-articles></shared-articles>
    </div>
    <!--    <div class="container-fluid">-->
    <!--    <div class="d-flex justify-content-center text-center" id="errorsearch" v-else>-->
    <!--      <masonry :cols="1">-->
    <!--        <b-spinner v-if="pageLoader" style="width: 6rem; height: 6rem;" variant="secondary"-->
    <!--                   label="Large Spinner"></b-spinner>-->
    <!--        <div v-else>-->
    <!--          <i class="far fa-frown fa-10x"></i>-->
    <!--        </div>-->
    <!--        <h1 v-text="msg"></h1>-->
    <!--      </masonry>-->
    <!--    </div>-->
    <!--    </div>-->
  </no-ssr>
</template>

<script>
    import SharedArticles from "~/components/SharedArticles.vue";

    export default {
        name: "recommendations",
        components: {
            SharedArticles
        },
        mounted(){
            alert("Your screen resolution is: " + screen.width + "x" + screen.height);
        },
        data() {
        },
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
    left: 32%;
    top: 40%;
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

  .feed-card {
    margin: 20px 0px 0px 0px;
  }

  #errorsearch {
    color: #e0e0e08d;
    margin-top: 50px;
  }

  #errorsearch h1 {
    color: #e0e0e0;
    margin-top: 50px;
    font-size: 3.5rem;
  }

  .fa-10x {
    font-size: 20em;
  }

  .publisher {
    color: #bdbdbd;
    font-weight: 500;
    text-transform: uppercase;
  }

  @media only screen and (max-width: 1280px) {
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
  }

  @media only screen and (max-width: 1000px) {
    .backdrop_header {
      position: absolute;
      left: 7%;
      top: 15%;
      z-index: 2;
      font-family: "Open Sans", serif;
      display: block;
      font-weight: 700;
      font-size: 100px;
      color: whitesmoke;
      letter-spacing: 1px;
      text-shadow: 2px 2px 5px black;
    }
  }


  @media only screen and (max-width: 700px) {
    .backdrop_header {
      position: absolute;
      left: 7%;
      top: 15%;
      z-index: 2;
      font-family: "Open Sans", serif;
      display: block;
      font-weight: 700;
      font-size: 75px;
      color: whitesmoke;
      letter-spacing: 1px;
      text-shadow: 2px 2px 5px black;
    }
  }
</style>
