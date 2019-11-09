<template>
  <no-ssr>
    <div v-if="articles.length > 0">
      <h1 class="f-h1" v-if="this.$route.fullPath === '/feed'">Top Stories</h1>
      <h1 class="f-h1" v-else v-text="this.$route.query.q"></h1>
      <div>
        <article-card v-for="article in articles" v-bind:article="article" v-bind:key="article.url"></article-card>
      </div>

      <div style="display: flex; justify-content: center;">
        <b-button class="align-self-center" variant="outline-primary" @click="loadMore()"><b>Load More</b></b-button>
      </div>
    </div>

    <div v-else class="d-flex justify-content-center text-center" id="errorsearch">
      <masonry :cols="1">:
        <b-spinner v-if="pageLoader" style="width: 6rem; height: 6rem;" variant="secondary"
                   label="Large Spinner"></b-spinner>
        <div v-else>
          <i class="far fa-frown fa-8x"></i>
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
                page: 1,
                url: "",
                language: "en"
            };
        },
        mounted: function () {
            // mounted will run functions after page is loaded
            if (!localStorage.getItem("jwt")) {
                this.$router.replace({name: "login"});
            }

            let currURL = document.location.href;
            let params = currURL.split("?");

            if (params.length > 1) {
                this.language = params[1].split("language=")[1];
                params = params[1];
                this.url = "https://newsapi.org/v2/everything?apiKey=7b8d0f9048464a8fa74e3edf2c215b8d&" + params;
            } else {
                this.url = "https://newsapi.org/v2/top-headlines?country=sg&apiKey=7b8d0f9048464a8fa74e3edf2c215b8d";
            }

            this.pageBuffer();
            this.fetchData(this.url, this.language, this.page);
        },
        methods: {
            async fetchData(url, language, page) {
                let user = JSON.parse(localStorage.getItem("user"));
                const res = await this.$axios.$get(url + "&page=" + page);

                let jwt = localStorage.getItem("jwt");
                const headers = {
                    'Authorization': 'Bearer ' + jwt
                }

                const savedArticles = await this.$axios.$get("https://sa-api.eof.cx/savedarticles?user=" + user.id, {
                    headers: headers
                });

                let _articles = res.articles

                for (let i = 0; i < _articles.length; i++) {
                    _articles[i].language = language;
                    _articles[i].uniqueid = user.id + "|" + _articles[i].url
                    _articles[i].saved = false;
                }

                for (let y = 0; y < savedArticles.length; y++) {
                    for (let i = 0; i < _articles.length; i++) {
                        if (_articles[i].uniqueid === savedArticles[y].uniqueid) {
                            _articles[i].saved = true;
                            _articles[i].savedid = savedArticles[y].id
                        }
                    }
                }

                for (let i = 0; i < _articles.length; i++) {
                    this.articles.push(_articles[i])
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
            loadMore: function () {
                this.page += 1
                this.fetchData(this.url, this.language, this.page);
            }
        }
    };
</script>

<style scoped>
  .f-h1 {
    font-weight: 800;
    padding-bottom: 10px;
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
