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
        v-for="article in articles"
        :key="article.id"
        :caption="article.title"
        :text="article.description"
        :img-src="article.urlToImage"
        class="image_sliders"
      ></b-carousel-slide>

    </b-carousel>
<!--    {{articles}}-->
  </div>
</template>

<script>
    export default {
        name:"sharedArticles",
        data: function () {
            return {
                slides: 3,
                articles: [],
                // get latest set of 9 articles shared
                latest_shared_limit: 9,
                savedMsg: "Bookmark news",
                latest_sort_col: "id",
                latest_sort_order: "DESC", // descending order;

                model: 0,
                showArrows: false,
                hideDelimiters: false,
                cycle: true,

                saved: false,
                pageLoader: true,
                msg: "Loading...",
                savedmsg: "Bookmark News",
                languages: [
                    {code: "en", desc: "English", isActive: false},
                    {code: "es", desc: "Spanish/español", isActive: false},
                    {code: "ar", desc: "Arabic/عربى", isActive: false},
                    {code: "zh", desc: "Chinese/中文", isActive: false}
                ],
            }
        },
        mounted: function () {
            // mounted will run functions after page is loaded
            let bearerToken = localStorage.getItem("jwt") ? localStorage.getItem("jwt") : this.$router.replace({name: "login"});
            let keywords = localStorage.getItem("search_keywords") ? localStorage.getItem("search_keywords") : "null";
            console.log("current keywords", keywords);


            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + bearerToken
                }
            };

            let url = "https://sa-api.eof.cx/articles?_limit=" + this.latest_shared_limit + "&_sort=" + this.latest_sort_col + ":" + this.latest_sort_order;
            this.fetchSharedArticles(url, config);
        },
        methods: {
            async fetchSharedArticles(url, config) {
                console.table(url, config);
                await this.$axios.$get(url, config)
                    .then((response) => {
                        console.log(response);
                        this.articles = response;

                        for (let i = 0; i < this.articles.length; i++) {
                            // set the language property for each article for translation use later on
                            this.articles[i].language = "en";
                            this.articles[i].saved = false;
                            this.articles[i].saveMessage = "Bookmark News";
                            this.articles[i].uniqueid = user.id + "|" + this.articles[i].url;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            redirect(url) {
                // console.log(url);
                window.open(url, "_blank");
            },
            saveNews(i, type) {
                // type denotes if the savenews is coming from a sharedArticle or recommended article
                let user = JSON.parse(localStorage.getItem("user"));
                let jwt = localStorage.getItem("jwt");

                let article = this.articles[i];
                article.saved = !article.saved;

                this.$set(this.articles, i, article);
                // this.$set(this.articles, i, article);

                const headers = {
                    'Authorization': 'Bearer ' + jwt
                };

                if (article.saved) {
                    this.savedMsg = "Bookmarked";
                    article.saveMessage = "Bookmarked";

                    let data = {
                        "url": article.url,
                        "urlToImage": article.urlToImage,
                        "title": article.title,
                        "description": article.description,
                        "user": user.id,
                        "display": true,
                        "uniqueid": user.id + "|" + article.url
                    };

                    this.$axios
                        .post(process.env.baseUrl + "/savedarticles",
                            data,
                            {
                                headers: headers
                            })

                } else {
                    this.$axios
                        .delete(process.env.baseUrl + "/savedarticles/" + article.savedid,
                            {
                                headers: headers
                            });
                    this.savedMsg = "Bookmark";
                    article.saveMessage = "Bookmark";
                }
            }
        }
    }
</script>

<style scoped>
  .image_sliders{
    width: auto;
    /*display: block;*/
    margin: 0 auto;
    max-height: 200px !important;
  }
</style>
