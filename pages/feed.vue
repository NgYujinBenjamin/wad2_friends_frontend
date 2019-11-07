<template>
  <no-ssr>
    <div v-if="articles.length > 0">
      <masonry :cols="4" :gutter="20">
        <div v-for="(article, index) in articles" :key="index">
          <b-card
            class="feed-card"
            :img-src="article.urlToImage"
            img-alt="Article Image"
            img-top
            :title="article.title"
          >
            <b-card-text v-text="article.description" v-model="index"></b-card-text>
            <hr>
            <div class="card-text">
              <a
                href="#"
                @click.prevent="redirect(article.url)"
                class="card-link d-inline"
              >Read Full Article</a>
              <a
                href="#"
                v-b-modal="'myModal' + index"
                class="card-link d-inline float-right"
              ><i class="fas fa-share"></i> Share</a>
              <a
                href="#"
                @click="savedNews"
                class="card-link d-inline float-right"
              ><i :class="[saved ? 'fas fa-bookmark' : 'far fa-bookmark']"></i> {{savedmsg}}</a>
            </div>

            <b-modal v-bind:id="'myModal'+index" :title="'Article '+index" header-bg-variant="primary"
                     header-text-variant="light">
              <template v-slot:modal-header="{ close }">
                <!-- Emulate built in modal header close button action -->
                <h5><i class="fab fa-facebook-square fa-lg"></i> Share on Facebook</h5>
                <!-- <h6>{{article.title}}</h6> -->
              </template>

              <template>
                <textarea style="width: 100%; min-height: 150px;" v-text="article.description"></textarea>
                <!-- <b-card-text v-text="article.description" v-model="index"></b-card-text> -->
                <img alt="Article Image" :src="article.urlToImage" class="w-100"/>
              </template>

              <template v-slot:modal-footer="{ ok, cancel, hide }">
                <b-dropdown id="dropdown-offset" variant="outline-info" offset="25" size="sm" text="Translate"
                            class="m-2">
                  <b-dropdown-item
                    v-for="(language, index_lang) in languages" :key="index_lang"
                    @click.prevent="translate(index,language.code)"
                  >{{language.desc}}
                  </b-dropdown-item>
                </b-dropdown>
                <b-button size="sm" variant="outline-secondary" @click="cancel()">Cancel</b-button>
                <b-button size="sm" variant="primary" @click="postToBuffer(article.description, article.url)">Post to
                  Facebook
                </b-button>
              </template>
            </b-modal>

            <!--          <div v-for="language in languages">-->
            <!--            <button class="btn-outline-success" @click="translate(article.description,language.code)">-->
            <!--              <span v-text="language.desc"></span>-->
            <!--            </button>-->
            <!--          </div>-->
          </b-card>
        </div>
      </masonry>
    </div>

    <div v-else class="d-flex justify-content-center text-center" id="errorsearch">
      <masonry :cols="1">
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

    export default {
        name: "feed",
        components: {},
        data() {
            return {
                saved: false,
                pageLoader: true,
                msg: "Loading...",
                savedmsg: "Bookmark News",
                articles: [],
                languages: [
                    {code: "en", desc: "English", isActive: false},
                    {code: "es", desc: "Spanish/español", isActive: false},
                    {code: "ar", desc: "Arabic/عربى", isActive: false},
                    {code: "zh", desc: "Chinese/中文", isActive: false}
                ]
            };
        },
        // async asyncData({$axios}) {
        // dont delete this asyncData first, it may be useful in the future
        // asyncData is used to run function before a page is loaded
        // let currURL = window.location.href;
        // console.table(this.$route.query.page);
        // console.log("Full path is " + params);
        // console.log(currURL.split("?")[1]);
        // const articles = await $axios.$get('https://newsapi.org/v2/top-headlines?country=sg&apiKey=7b8d0f9048464a8fa74e3edf2c215b8d&').then(res => res.articles)
        // return {articles}
        // },
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
                url =
                    "https://newsapi.org/v2/everything?apiKey=7b8d0f9048464a8fa74e3edf2c215b8d&" +
                    params;
            } else {
                // if feed page is visited directly without any parameters
                // use the headlines url instead
                url =
                    "https://newsapi.org/v2/top-headlines?country=sg&apiKey=7b8d0f9048464a8fa74e3edf2c215b8d";
            }

            // console.log(params,language);
            this.pageBuffer();
            this.fetchData(url, language);
        },
        methods: {
            translate: function (index, language) {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": "d9e003958b7244daa92f6cd96ce39cdb"
                    }
                };

                let currLanguage = this.articles[index].language;
                let url =
                    "https://api-apc.cognitive.microsofttranslator.com/translate?api-version=3.0&from=" +
                    currLanguage +
                    "&to=" +
                    language;
                this.$axios
                    .post(url, [{text: this.articles[index].description}], config)
                    .then(response => {
                        let translated = response.data[0]["translations"];
                        this.articles[index].description = translated[0].text;
                        this.articles[index].language = language;
                        // console.table(translated[0].text, language, currLanguage);
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            redirect(url) {
                window.open(url, "_blank");
            },
            async fetchData(url, language) {
                const res = await this.$axios.$get(url);
                this.articles = res.articles;

                for (let i = 0; i < this.articles.length; i++) {
                    // set the language property for each article for translation use later on
                    this.articles[i].language = language;
                }
            },
            savedNews() {
                if (!this.saved) {
                    this.saved = true;
                    this.savedmsg = "Bookmarked";
                } else {
                    this.saved = false;
                    this.savedmsg = "Bookmark News";
                }
            },
            pageBuffer: function () {
                var set = this;
                setTimeout(function () {
                    console.log("true");
                    set.pageLoader = false;
                    set.msg = "No results found";
                }, 2000);
            },
            postToBuffer: function (msg, link) {
                let url = "https://graph.facebook.com/112606970182817/feed"
                const token = "EAAHsGZAfkZA5MBAFQkVnEWb6bnS3lFRHMtLfvufQt9r2NJwAYspX6JBSZCA1WxZAMmh2QJZCJET4pZAA2kiDEsP8KM08jwAjnG26PZCdWNSybD75fO6dAGMZC7HX6yJSkVkgxr7uzYx1DmTUxWJzMsFLDPRElY8qZBy0QwdmfQFUYvdAWmE0LIBLovnThiLnPtmZBjGsb0MkaDFESkHgvc1mbZB"
                let params = "?message=" + msg + "&link=" + link + "&access_token=" + token
                url += params

                this.$axios
                    .post(url, [])
                    .then(response => {
                        this.$toast.success("Post Successfully Posted", {
                            icon: {name: "check-circle"}
                        });
                    })
                    .catch(e => {
                        this.$toast.error("Error: " + e.message, {
                            icon: {name: "exclamation-triangle"}
                        });
                    });
            },
        }
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
</style>
