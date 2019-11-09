<template>
  <div>
    <b-carousel
      :interval="100000"
      controls
      indicators
      background="#eceff1"
      style="text-shadow: 1px 1px 2px #333;"
      v-if="articles.length > 0"
      id="fullscreen"
    >
      <span v-for="(article,index) in articles" :key="article.id">
        <b-carousel-slide
          img-src="~/assets/grey_bg.png"
          class="image_sliders"
          v-if="index%3 === 0"
        >
          <div class="row">
            <div class="col" style="margin:auto; width:100%; position:relative;">
            <b-card
              class="card-shared d-inline"
              :img-src="article.urlToImage"
              img-alt="Article Image"
              img-height="100%"
              overlay
            >
            <div style="margin:auto; display:flex;">
              <button>Share</button>
              <button>Bookmark</button>
            </div>
              <b-card-body style="width:100%; position: absolute;" v-text="article.title"></b-card-body>
            </b-card>
            </div>
            <div class="col" style="position:relative;">
            <b-card
              class="card-shared d-inline"
              :img-src="articles[index+1].urlToImage"
              img-alt="Article Image"
              img-height="100%"
              overlay
            >
              <!-- <b-card-body v-text="articles[index+1].title"></b-card-body> -->
            </b-card>
            </div>
            <div class="col" style="position:relative;">
            <b-card
              class="card-shared d-inline"
              :img-src="articles[index+2].urlToImage"
              img-alt="Article Image"
              img-height="100%"
              overlay
            >
              <!-- <b-card-body v-text="articles[index+2].title"></b-card-body> -->
            </b-card>
            </div>
          </div>
        </b-carousel-slide>
      </span>
    </b-carousel>

    <b-carousel
      :interval="4000"
      controls
      indicators
      background="#eceff1"
      style="text-shadow: 1px 1px 2px #333;"
      v-if="articles.length > 0"
      id="halfscreen"
    >
      <span v-for="(article,index) in articles" :key="article.id">
        <b-carousel-slide
          img-src="~/assets/grey_bg.png"
          class="image_sliders"
          v-if="index%2 === 0"
        >
          <div class="row">
            <b-card
              class="card-shared d-inline"
              :img-src="article.urlToImage"
              img-alt="Article Image"
              img-height="100%"
              overlay
            >
            <b-card-body v-text="article.title"></b-card-body>
          </b-card>

            <b-card
              class="card-shared d-inline"
              :img-src="articles[index+1].urlToImage"
              img-alt="Article Image"
              img-height="100%"
              overlay
            >
            <b-card-body v-text="articles[index+1].title"></b-card-body>
          </b-card>

          </div>
        </b-carousel-slide>
      </span>
    </b-carousel>

    <b-carousel
      :interval="4000"
      controls
      indicators
      background="#eceff1"
      style="text-shadow: 1px 1px 2px #333;"
      v-if="articles.length > 0"
      id="mobile"
    >
      <b-carousel-slide
        img-src="~/assets/grey_bg.png"
        class="image_sliders"
        v-for="(article,index) in articles"
        :key="index"
      >
        <div class="row">
          <b-card
            class="card-shared d-inline"
            :img-src="article.urlToImage"
            img-alt="Article Image"
            img-height="100%"
            overlay
          >
            <br/><br/><br/><br/>
            <b-card-header v-text="article.title"></b-card-header>
          </b-card>
        </div>
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
    export default {
        name: "sharedArticles",
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
                        let user = JSON.parse(localStorage.getItem("user"));
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
  .image_sliders {
    width: 100%;
    /*display: block;*/
    /*margin: 0 auto;*/
    height: 350px;
    max-height: 350px !important;
  }

  #fullscreen .card-shared {
    width: 31%;
    margin-left: 1%;
    margin-right: 1%;
  }

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

  #mobile .card-shared {
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
  }

  #mobile img.card-img {
    width: 100%;
    height: 211.19px;
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
    
  button {
  background-color: #046307; /* Green */
  border: none;
  color: white;
  padding: 4px 28px;
  text-align: center;
  font-size: 14px;
  border-radius:32px;
  margin-left: 35px;
}

</style>
