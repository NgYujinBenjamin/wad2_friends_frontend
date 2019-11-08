<template>
    <div id="carousel" class="carousel slide" data-ride="carousel" data-interval="3000">
        <ol class="carousel-indicators">
            <li data-target="#carousel" data-slide-to="0" class="active"></li>
            <li data-target="#carousel" data-slide-to="1"></li>
            <li data-target="#carousel" data-slide-to="2"></li>
        </ol>
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img class="d-block w-100 h-100" :src="carouselArticles[0]? carouselArticles[0].urlToImage : 'https://membershipdrive.com/wp-content/uploads/2014/06/placeholder.png'" alt="First slide">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100 h-100" :src="carouselArticles[1]? carouselArticles[1].urlToImage : 'https://membershipdrive.com/wp-content/uploads/2014/06/placeholder.png'" alt="Second slide">
            </div>
            <div class="carousel-item">
                <img class="d-block w-100 h-100" :src="carouselArticles[2]? carouselArticles[2].urlToImage : 'https://membershipdrive.com/wp-content/uploads/2014/06/placeholder.png'" alt="Third slide">
            </div>
        </div>
        <!-- left and right controls (not working for now)-->
        <a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" ></span>
                <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carousel" role="button" data-slide="next">
                <span class="carousel-control-next-icon"></span>
                <span class="sr-only">Next</span>
        </a>
    </div>
</template>

<script>
export default {
    data() {
            return {
                carouselArticles: {},
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