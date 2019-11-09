<template>
  <no-ssr>
    <div v-if="articles.length > 0">
      <masonry :cols="{default: 4, 1000: 3, 700: 1, 400: 1}"
               :gutter="{default: '30px', 700: '15px'}">
        <article-card v-for="article in articles" v-bind:article="article" v-bind:key="article.url"></article-card>
      </masonry>
    </div>

    <div v-else class="d-flex justify-content-center text-center" id="errorsearch">
      <masonry :cols="1">:
        <b-spinner v-if="pageLoader" style="width: 6rem; height: 6rem;" variant="secondary"
                   label="Large Spinner"></b-spinner>
        <div v-else>
          <i class="far fa-frown fa-10x"></i>
        </div>
        <h1 v-text="msg"></h1>
      </masonry>
    </div>
  </no-ssr>
</template>

<script>
    import "@fortawesome/fontawesome-free/css/all.css";
    import ArticleCard from "../components/feed/article-card";

    export default {
        name: "feed",
        components: {ArticleCard},
        data() {
            return {
                saved: false,
                pageLoader: true,
                msg: "Loading...",
                savedMsg: "Bookmark News",
                articles: [],
                languages: [
                    {code: "en", desc: "English", isActive: false},
                    {code: "es", desc: "Spanish/español", isActive: false},
                    {code: "ar", desc: "Arabic/عربى", isActive: false},
                    {code: "zh", desc: "Chinese/中文", isActive: false}
                ]
            };
        },
        mounted: function () {
            // mounted will run functions after page is loaded
            if (!localStorage.getItem("jwt")) {
                this.$router.replace({name: "login"});
            }

            let currURL = document.location.href;
            let params = currURL.split("?");
            // console.log("params", params, params.length);
            let language = "en";
            let url = "";

            // check if there is any parameters from index.vue
            if (params.length > 1) {
                language = params[1].split("language=")[1];
                params = params[1];
                url = "https://newsapi.org/v2/everything?apiKey=7b8d0f9048464a8fa74e3edf2c215b8d&" + params;
            } else {
                // if feed page is visited directly without any parameters
                // use the headlines url instead
                url = "https://newsapi.org/v2/top-headlines?country=sg&apiKey=7b8d0f9048464a8fa74e3edf2c215b8d";
            }

            // console.log(params,language);
            this.pageBuffer();
            this.fetchData(url, language);
        },
        methods: {
            async fetchData(url, language) {
                let user = JSON.parse(localStorage.getItem("user"));
                const res = await this.$axios.$get(url);

                let jwt = localStorage.getItem("jwt");
                const headers = {
                    'Authorization': 'Bearer ' + jwt
                }

                const savedArticles = await this.$axios.$get("https://sa-api.eof.cx/savedarticles?user=" + user.id, {
                    headers: headers
                });

                this.articles = res.articles;

                for (let i = 0; i < this.articles.length; i++) {
                    this.articles[i].language = language;
                    this.articles[i].uniqueid = user.id + "|" + this.articles[i].url
                    this.articles[i].saved = false;
                }

                for (let y = 0; y < savedArticles.length; y++) {
                    for (let i = 0; i < this.articles.length; i++) {
                        if (this.articles[i].uniqueid === savedArticles[y].uniqueid) {
                            this.articles[i].saved = true;
                            this.articles[i].savedid = savedArticles[y].id
                        }
                    }
                }
            },
            pageBuffer: function () {
                var set = this;
                setTimeout(function () {
                    // console.log("true");
                    set.pageLoader = false;
                    set.msg = "No results found";
                }, 2000);
            },
        }
    };
</script>

<style scoped>
  .feed-card {
    margin: 20px 0 0 0;
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
</style>
