<template>
  <div>
    <!--   previous b-carousel grey colour: #eceff1-->
    <div v-if="articles.length > 0">
      <b-carousel
        :interval="100000"
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
            <feature-article-card class="d-inline halfCard" v-bind:article="article" v-bind:article-width="30"
                                 v-bind:hover-text="'Read Article'" v-bind:type="'full'"
                                 v-bind:key="article.url"></feature-article-card>
            <feature-article-card class="d-inline halfCard" v-bind:article="articles[index+1]" v-bind:article-width="30"
                                 v-bind:hover-text="'Read Article'" v-bind:type="'full'"
                                 v-bind:key="articles[index+1].url"></feature-article-card>
            <feature-article-card class="d-inline halfCard" v-bind:article="articles[index+2]" v-bind:article-width="30"
                                 v-bind:hover-text="'Read Article'" v-bind:type="'full'"
                                 v-bind:key="articles[index+2].url"></feature-article-card>
          </div>
        </b-carousel-slide>
      </span>
      </b-carousel>

      <b-carousel
        :interval="400000"
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
            <feature-article-card class="d-inline halfCard" v-bind:article="article" v-bind:article-width="45"
                                 v-bind:hover-text="'Read Article'" v-bind:type="'half'"
                                 v-bind:key="article.url"></feature-article-card>
            <feature-article-card class="d-inline halfCard" v-bind:article="articles[index+1]" v-bind:article-width="45"
                                 v-bind:hover-text="'Read Article'" v-bind:type="'half'"
                                 v-bind:key="articles[index+1].url"></feature-article-card>
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
          <feature-article-card class="mobileCard" v-bind:article="article" v-bind:article-width="100"
                               v-bind:hover-text="'Read Full Article'" v-bind:type="'mobile'"
                               v-bind:key="article.url"></feature-article-card>
        </b-carousel-slide>
      </b-carousel>
    </div>

  </div>
</template>

<script>
    import "@fortawesome/fontawesome-free/css/all.css";
    import FeatureArticleCard from "./feature-article-card";

    export default {
        name: "sharedArticles",
        components: {FeatureArticleCard},
        data: function () {
            return {
                slides: 3,
                articles: [],
                // get latest set of 12 articles shared
                latest_shared_limit: 12,
                savedMsg: "Bookmark news",
                latest_sort_col: "id",
                latest_sort_order: "DESC", // descending order;

                model: 0,
                showArrows: false,
                hideDelimiters: false,
                cycle: true,

                // for profile
                imgSet: require('@/assets/noimageavailable.png'),

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
                    _articles[i].language = res.language == null ? "en" : res.language;
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
            }
        }
    }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Open%20Sans');

  * {
    font-family: "Open Sans", serif;
  }

  .image_sliders {
    width: 100%;
    height: 350px;
    max-height: 350px !important;
  }

  /*#fullscreen .card-shared {*/
  /*  width: 31%;*/
  /*}*/

  #fullscreen img.card-img {
    width: 100%;
    height: 211.19px;
  }

  #halfscreen .card-shared {
    width: 48%;
    margin-left: 1%;
    margin-right: 1%;
  }

  #halfscreen img.card-img {
    width: 100%;
    height: 211.19px;
  }

  .halfCard.overallCard {
    /*border: 1px solid red;*/
    height: 250px;
  }

  .halfCard.overallCard.cardTextBlock.card-title {
    border: 1px solid red !important;
  }

  #mobile .image_sliders {
    height: 500px;
    max-height: 500px !important;
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
