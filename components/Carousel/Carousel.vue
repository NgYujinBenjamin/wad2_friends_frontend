<template>
    <div id="carousel" class="carousel slide" data-ride="carousel">
        <ol class="carousel-indicators">
            <li data-target="#carousel" data-slide-to="0" class="active"></li>
            <li data-target="#carousel" data-slide-to="1"></li>
            <li data-target="#carousel" data-slide-to="2"></li>
            </ol>
        <div class="carousel-inner">
            <div class="carousel-item" v-for="(article, index) in articles" :key="index">
                <img class="d-block w-100" ><!--:src="article.urlToImage">-->
            </div>
        </div>
        <!-- left and right controls -->
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
    props: [
        'articles'
    ]

}
</script>