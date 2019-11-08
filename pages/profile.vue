<template>
  <div id="profile" class="row" style="height: 94vh;">
    <div class="col-lg-3 p-2"
         style="background: #e9ecef; box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.02), 0px 2px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 5px 0px rgba(0, 0, 0, 0.06)">
      <div class="h3 mt-5" style="color:rgb(33, 33, 33); padding-left: 38px;">
        <strong>Account Information</strong>
      </div>

      <v-card
        class="v-sheet theme--dark mt-4 mb-4 mx-auto"
        supportingtext="true"
        color="#48C9B0"
        width="90%"
      >
        <div class="v-card__title">Username</div>
        <div class="v-card__text content">{{username}}</div>
      </v-card>
      <v-card class="v-sheet mb-4 mx-auto" supportingtext="true" width="90%">
        <div class="v-card__title">E-mail address</div>
        <div class="v-card__text content">
          {{email}}
          <button
            class="v-btn v-btn--contained v-btn--rounded theme--dark v-size--x-small float-right"
            size="x-small"
            id="emailVerification"
            disabled
          >
            <span class="v-btn__content text">
              <span>Verified</span>
            </span>
            <span class="v-btn__content icon">
              <i class="fas fa-check-circle"></i>
            </span>
          </button>
        </div>
      </v-card>
      <v-card class="v-sheet theme--light mb-4 mx-auto" supportingtext="true" width="90%">
        <div class="v-card__title">Password</div>
        <div class="v-card__text">
          <input class="form-control" style="width: 58%; display: initial;" disabled type="password"
                 v-model="password"/>
          <div data-app class="float-right mr-3 pt-3">
            <changepassword/>
          </div>
        </div>
      </v-card>
    </div>

    <div class="p-1">
    </div>

    <div class="col">
      <div class="h3 ml-3 mt-5" style="color:rgb(33, 33, 33);">
        <strong>Bookmarked News</strong>
      </div>
      
      <div v-if="this.savedArticles.length > 0">
        <v-hover v-slot:default="{ hover }" v-for="(article,index) in this.savedArticles" :key="index">

          <v-card class="ml-3 my-3 overallCard" id="card-width">
            <!-- image -->
            <v-img :aspect-ratio="16/9" :src="article.urlToImage">
              <!-- hover effect -->
              <v-expand-transition>
                <a v-if="hover" class="d-flex transition-fast-in-fast-out v-card--reveal card-link"
                  :href="article.url" target="_blank">
                  Read full article
                </a>
              </v-expand-transition>
            </v-img>

            <v-card-text style="position: relative;">
              <!-- Bookmark -->
              <v-btn absolute class="articleButton" color="rgb(72, 201, 176)" fab medium right top @click="deleteBookmark(index)" >
                <i class="fas fa-bookmark fa-lg"></i>
              </v-btn>
              <!-- Share -->
              <v-btn absolute color="rgb(72, 201, 176)" fab medium right top v-b-modal="'myModal' + index">
                <i class="fas fa-share fa-lg"></i>
              </v-btn>
              <!-- Details -->
              <em class="font-weight-normal title mb-2 publisher" v-text="article.publisher"></em>
              <h3 class="mb-2 card-title" v-text="article.title"></h3>
              <div class="font-weight-normal title mb-2 card-title card-desc" v-text="article.description"></div>
            </v-card-text>

            <!-- Facebook Popup -->
            <b-modal v-bind:id="'myModal'+ index" :title="'Article '+index" header-bg-variant="primary" header-text-variant="light">
              <template v-slot:modal-header="{ close }">
                <h5><i class="fab fa-facebook-square fa-lg"></i> Share on Facebook</h5>
              </template>

              <template>
                <textarea style="width: 100%; min-height: 150px;" v-text="article.description"></textarea>
                <img alt="Article Image" :src="article.urlToImage" class="w-100"/>
              </template>

              <template v-slot:modal-footer="{ ok, cancel, hide }">
                <b-dropdown id="dropdown-offset" variant="outline-info" offset="25" size="sm" text="Translate" class="m-2">
                  <b-dropdown-item v-for="(language, index_lang) in languages" :key="index_lang" @click.prevent="translate(index,language.code)">
                    {{language.desc}}
                  </b-dropdown-item>
                </b-dropdown>
                <b-button size="sm" variant="outline-secondary" @click="cancel()">Cancel</b-button>
                <b-button size="sm" variant="primary" @click="postToFB(article.description, article.url)">
                  Post to Facebook
                </b-button>
              </template>
            </b-modal>

          </v-card>

        </v-hover>
      </div>

      <div v-else>
        <h4 id="noBookmark" class="ml-3 my-3">No news saved</h4>
      </div>
    </div>

  </div>
</template>

<script>
    import changepassword from "~/components/changepassword.vue";

    export default {
        components: {changepassword},
        name: "profile",
        data() {
            return {
                maxLength: 100,
                email: "Placeholder Email",
                username: "Placeholder Name",
                password: "88888888888888",
                savedArticles: [],
                languages: [
                    {code: "en", desc: "English", isActive: false},
                    {code: "es", desc: "Spanish/español", isActive: false},
                    {code: "ar", desc: "Arabic/عربى", isActive: false},
                    {code: "zh", desc: "Chinese/中文", isActive: false}
                ]
            };
        },
        mounted: function () {
            if (!localStorage.getItem("jwt")) {
                this.$router.replace({name: "login"});
            }
            var user = JSON.parse(localStorage.getItem("user"));
            this.username = user.username;
            this.email = user.email;
            this.fetchBookmarkedArticles(user.id);
        },
        methods: {
            async fetchBookmarkedArticles(userId) {
                let jwt = localStorage.getItem("jwt");
                const headers = {
                    'Authorization': 'Bearer ' + jwt
                };
                this.savedArticles = await this.$axios.$get("https://sa-api.eof.cx/savedarticles?user=" + userId, {
                    headers: headers
                });
            },
            translate: function (index, language) {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": "d9e003958b7244daa92f6cd96ce39cdb"
                    }
                };

                let currLanguage = this.savedArticles[index].language;
                let url =
                    "https://api-apc.cognitive.microsofttranslator.com/translate?api-version=3.0&from=" +
                    currLanguage +
                    "&to=" +
                    language;
                this.$axios
                    .post(url, [{text: this.savedArticles[index].description}], config)
                    .then(response => {
                        let translated = response.data[0]["translations"];
                        this.savedArticles[index].description = translated[0].text;
                        // do not delete the line below, it is for user to change translation multiple times
                        this.savedArticles[index].language = language;
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },
            deleteBookmark(i) {
                let user = JSON.parse(localStorage.getItem("user"));
                let jwt = localStorage.getItem("jwt");

                let article = this.savedArticles[i];
                console.log(article);
                article.isSaved = !article.isSaved;
                this.$set(this.savedArticles, i, article)

                const headers = {
                    'Authorization': 'Bearer ' + jwt
                }
                this.$axios
                    .delete(process.env.baseUrl + "/savedarticles/" + article.id,
                        {
                            headers: headers
                        })
                location.reload();
            },
            // Just FYI: Copied directly from feed without changing anything; assuming that it will work
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
    };
</script>

<style scoped>
  .content {
    font-size: 1rem;
  }

  .theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
    background-color: #48c9b0;
    color: black;
    font-weight: 700;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.02), 0px 2px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 5px 0px rgba(0, 0, 0, 0.06);
  }

  .overallCard{
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.02), 0px 2px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 5px 0px rgba(0, 0, 0, 0.06); 
    display:inline-block; 
    height: 100%;
  }

  .card-title{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 3vh;
    height: 7vh;
  }

  .card-link{
    height: 100%; 
    background-color: 
    rgb(72, 201, 176); 
    color: black; 
    font-size: 4vh; 
    text-decoration: inherit;
  }

  .card-desc{
    height: 150px;
    font-size: 1.7vh;
    line-height: 2.5vh;
  }

  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .7;
    position: absolute;
    width: 100%;
  }

  .publisher{
    font-weight: 500;
    text-transform: uppercase;
  }

  #noBookmark {
    color: #e0e0e0;
    margin-top: 50px;
  }

  #card-width{
    max-width: 440px;
  }

  span.icon {
    color: black;
  }

  span.text {
      display: inline-block;
    }
  
  .articleButton{
    right: 20%;
  }

  @media only screen and (max-width: 450px) {
    .articleButton{
      right: 25%;
    }
  }

  @media only screen and (max-width: 800px) {
    #card-width{
      max-width: 100%;
      margin-right: 1rem;
    }
    .articleButton{
      right: 12%;
    }
  }

  @media only screen and (max-width: 1500px) {
    span.text {
      display: none;
    }
    span.icon {
      color: white;
    }
  }
</style>
