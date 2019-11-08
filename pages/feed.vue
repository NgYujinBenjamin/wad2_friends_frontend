<template>
  <no-ssr>
    <div v-if="articles.length > 0">
      <masonry :cols="{default: 4, 1000: 3, 700: 1, 400: 1}"
               :gutter="{default: '30px', 700: '15px'}">
        <div v-for="(article, index) in articles" :key="index">
          <b-card
            class="feed-card"
            :img-src="article.urlToImage"
            img-alt="Article Image"
            img-top
            :title="article.title.lastIndexOf(' - ') === -1 ? article.title : article.title.substring(0, article.title.lastIndexOf(' - '))"
          >
            <div>
              <em class="publisher"></em>
              <em class="publisher"
                  v-text="article.source.name"></em>
            </div>

            <b-card-text v-text="article.description" v-model="index" style="padding-top:7px;"></b-card-text>
            <hr>
            <div class="card-text">
              <a href="#" @click.prevent="redirect(article.url)" class="card-link d-inline">Read Full Article</a>
              <a href="#" v-b-modal="'myModal' + index" class="card-link d-inline float-right"><i
                class="fas fa-share"></i> Share</a>
              <a href="#" @click="saveNews(index)" class="card-link d-inline float-right">
                <i :class="article.saved ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
                <span v-if="article.saved">Bookmarked</span>
                <span v-else>Bookmark</span>
              </a>
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
                <b-button size="sm" variant="primary" @click="postToFB(article.description, article.url)">Post to
                  Facebook
                </b-button>
              </template>
            </b-modal>

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
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            redirect(url) {
                window.open(url, "_blank");
            },
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
                    this.articles[i].saveMessage = "Bookmark";
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
            saveNews(i) {
                let user = JSON.parse(localStorage.getItem("user"));
                let jwt = localStorage.getItem("jwt");

                let article = this.articles[i];
                article.saved = !article.saved;
                this.$set(this.articles, i, article)

                const headers = {
                    'Authorization': 'Bearer ' + jwt
                }

                if (article.saved) {
                    this.savedMsg = "Bookmarked";
                    article.saveMessage = "Bookmarked";

                    let data = {
                        "url": article.url,
                        "publisher": article.source.name,
                        "urlToImage": article.urlToImage,
                        "title": article.title,
                        "description": article.description,
                        "user": user.id,
                        "display": true,
                        "uniqueid": user.id + "|" + article.url
                    }

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
                            })
                    this.savedMsg = "Bookmark";
                    article.saveMessage = "Bookmark";
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
            postToFB: function (msg, link) {
                let url = "https://graph.facebook.com/112606970182817/feed";
                const token = "EAAHsGZAfkZA5MBAFQkVnEWb6bnS3lFRHMtLfvufQt9r2NJwAYspX6JBSZCA1WxZAMmh2QJZCJET4pZAA2kiDEsP8KM08jwAjnG26PZCdWNSybD75fO6dAGMZC7HX6yJSkVkgxr7uzYx1DmTUxWJzMsFLDPRElY8qZBy0QwdmfQFUYvdAWmE0LIBLovnThiLnPtmZBjGsb0MkaDFESkHgvc1mbZB";
                let params = "?message=" + msg + "&link=" + link + "&access_token=" + token;
                url += params;

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

  .publisher {
    color: #bdbdbd;
    font-weight: 500;
    text-transform: uppercase;
  }
</style>
