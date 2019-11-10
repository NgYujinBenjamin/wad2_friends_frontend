<template>
  <div>
    <!--   previous b-carousel grey colour: #eceff1-->
    <div v-if="articles.length > 0">
      <b-carousel
        :interval="4000"
        controls
        indicators
        background="#fffff"
        style="text-shadow: 1px 1px 2px #333;"
        id="fullscreen"
      >
      <span v-for="(article,index) in articles" :key="article.id">
        <b-carousel-slide
          img-src="~/assets/white_bg.png"
          class="image_sliders"
          v-if="index%3 === 0"
        >
          <div class="row">
            <article-card class="fullCard" v-bind:article="article"
                          v-bind:type="'full'" v-bind:key="article.url"></article-card>

            <article-card class="fullCard" v-bind:article="articles[index+1]"
                          v-bind:type="'full'" v-bind:key="articles[index+1].url"></article-card>

            <article-card class="fullCard" v-bind:article="articles[index+2]"
                          v-bind:type="'full'" v-bind:key="articles[index+2].url"></article-card>
          </div>
        </b-carousel-slide>
      </span>
      </b-carousel>

      <b-carousel
        :interval="4000"
        controls
        indicators
        background="#ffffff"
        id="halfscreen"
      >
      <span v-for="(article,index) in articles" :key="article.id">
        <b-carousel-slide
          img-src="~/assets/white_bg.png"
          class="image_sliders"
          v-if="index%2 === 0"
        >
          <div class="row">
            <article-card class="halfCard" v-bind:article="article"
                          v-bind:type="'half'" v-bind:key="article.url"></article-card>

            <article-card class="halfCard" v-bind:article="articles[index+1]"
                          v-bind:type="'half'" v-bind:key="articles[index+1].url"></article-card>
          </div>
        </b-carousel-slide>
      </span>
      </b-carousel>

      <b-carousel
        :interval="4000"
        controls
        indicators
        background="#ffffff"
        id="mobile"
      >
        <b-carousel-slide
          img-src="~/assets/white_bg.png"
          class="image_sliders"
          v-for="(article,index) in articles"
          :key="index"
        >

          <article-card class="mobileCard" v-bind:article="article"
                        v-bind:type="'mobile'" v-bind:key="article.url"></article-card>
        </b-carousel-slide>
      </b-carousel>
    </div>

    <div v-else class="d-flex justify-content-center text-center" id="errorsearch">
      <masonry :cols="1">:
        <b-spinner v-if="pageLoader" style="width: 6rem; height: 6rem;" variant="secondary"
                   label="Large Spinner"></b-spinner>
        <div v-else>
          <!--          <i class="far fa-frown fa-8x"></i>-->
          <!--          Soeone help fix, if possible-->
        </div>
        <h1 v-text="msg"></h1>
      </masonry>
    </div>

  </div>
</template>

<script>
    import ArticleCard from "~/components/feed/article-card";

    export default {
        name: "FeaturedArticleSlider",
        components: {ArticleCard},
        data: function () {
            return {
                slides: 3,
                articles: [],
                // get latest set of 12 articles shared
                latest_shared_limit: 12,
                latest_sort_col: "id",
                latest_sort_order: "DESC", // descending order;

                // for profile
                imgSet: require('@/assets/noimageavailable.png'),

                saved: false,
                pageLoader: true,
                msg: "Loading...",
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
            this.pageBuffer();
            this.fetchSharedArticles(url, config);
        },
        methods: {
            async fetchSharedArticles(url, config) {
                console.table(url, config);
                let user = JSON.parse(localStorage.getItem("user"));
                const res = await this.$axios.$get(url, config);

                let jwt = localStorage.getItem("jwt");
                const headers = {
                    'Authorization': 'Bearer ' + jwt
                };

                const savedArticles = await this.$axios.$get("https://sa-api.eof.cx/savedarticles?user=" + user.id, {
                    headers: headers
                });

                let _articles = res;

                for (let i = 0; i < _articles.length; i++) {
                    _articles[i]["source"] = {"name": _articles[i].publisher};
                    _articles[i].language = res.language == null ? "en" : res.language;
                    _articles[i].uniqueid = user.id + "|" + _articles[i].url;
                    _articles[i].saved = false;
                }

                for (let y = 0; y < savedArticles.length; y++) {
                    for (let i = 0; i < _articles.length; i++) {
                        if (_articles[i].uniqueid === savedArticles[y].uniqueid) {
                            _articles[i].saved = true;
                            _articles[i]["savedid"] = savedArticles[y].id;
                        }
                    }
                }

                for (let i = 0; i < _articles.length; i++) {
                    this.articles.push(_articles[i])
                }

                console.log(this.articles);
            },
            redirect(url) {
                // console.log(url);
                window.open(url, "_blank");
            },
            saveNews(i) {
                let user = JSON.parse(localStorage.getItem("user"));
                let jwt = localStorage.getItem("jwt");

                let article = this.articles[i];
                article.saved = !article.saved;
                this.$set(this.articles, i, article);

                const headers = {
                    'Authorization': 'Bearer ' + jwt
                };

                if (article.saved) {
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
                }
            },
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
                        this.$set(this.articles[index], 'description', translated[0].text);
                        this.$set(this.articles[index], 'language', language);
                    })
                    .catch(e => {
                        console.log(e);
                    });
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
            pageBuffer: function () {
                var set = this;
                setTimeout(function () {
                    // console.log("true");
                    set.pageLoader = false;
                    set.msg = "No results found";
                }, 1000);
            }
        }
    }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Open%20Sans');

  * {
    font-family: "Open Sans", serif;
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

  #mobile .image_sliders {
    height: 500px;
    max-height: 500px !important;
  }

  .mobileCard, .halfCard, .fullCard {
    margin: 0 auto !important;
  }

  #halfscreen .image_sliders {
    height: 400px;
    max-height: 400px !important;
  }

  #fullscreen .image_sliders {
    height: 450px;
    max-height: 450px !important;
  }

  .halfCard.overallCard {
    width: 46%;
    overflow: hidden;
  }

  .fa-10x {
    font-size: 20em;
  }

  /* Updating fonts and margin from article-card */
  .mobileCard.overallCard :nth-child(4) {
    margin-top: 7%;
    font-family: "Open Sans", serif;
  }

  .halfCard.overallCard :nth-child(4) {
    font-size: 18px;
    margin-top: 7%;
    font-family: "Open Sans", serif;
  }

  .fullCard.overallCard :nth-child(4) {
    margin-top: 7%;
    font-weight: normal;
    font-family: "Open Sans", serif;
  }

  @media only screen and (max-width: 4096px) {
    #fullscreen {
      display: block !important;
    }

    #halfscreen {
      display: none !important;
    }

    #mobile {
      display: none !important;
    }
  }

  @media only screen and (max-width: 1000px) {
    #fullscreen {
      display: none !important;
    }

    #halfscreen {
      display: block !important;
    }

    #mobile {
      display: none !important;
    }
  }


  @media only screen and (max-width: 700px) {
    #fullscreen {
      display: none !important;
    }

    #halfscreen {
      display: none !important;
    }

    #mobile {
      display: block !important;
    }
  }

</style>
