<template>
  <no-ssr>
  <div class="container-fluid">
    <shared-articles></shared-articles>
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
  </div>
  </no-ssr>
</template>

<script>
    import SharedArticles from "~/components/SharedArticles.vue";

    export default {
        name: "recommendations",
        components: {
            SharedArticles
        },
        data() {
        },
    };
</script>

<style scoped>
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
</style>
