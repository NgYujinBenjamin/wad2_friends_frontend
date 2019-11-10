<template>
  <v-hover v-slot:default="{ hover }">
    <v-card class="ml-3 my-3 overallCard">
      <!-- image -->
      <v-img :aspect-ratio="16/9" :src="article.urlToImage == null ? imgSet : article.urlToImage">
        <!-- hover effect -->
        <v-expand-transition>
          <a v-if="hover" class="d-flex transition-fast-in-fast-out v-card--reveal card-link"
             :href="article.url" target="_blank">
            Read Full Article
          </a>
        </v-expand-transition>
      </v-img>

      <v-card-text style="position: relative;">
        <!-- Bookmark -->
        <v-btn absolute class="articleButton mr-2" color="whitesmoke" fab medium right top
               @click="saveNews()">
          <i :class="saved ? 'fas fa-heart fa-lg' : 'far fa-heart fa-lg'"></i>
        </v-btn>
        <!-- Share -->
        <v-btn absolute color="whitesmoke" fab medium right top v-b-modal="article.url">
          <i class="fas fa-share-alt fa-lg"></i>
        </v-btn>
        <!-- Details -->
        <em class="font-weight-normal title mb-2 publisher" v-text="article.source.name"></em>
        <h3 class="mb-2 card-title" v-text="article.title.lastIndexOf(' - ') === -1 ? article.title : article.title.substring(0, article.title.lastIndexOf(' - '))"></h3>
<!--        <div class="font-weight-normal title mb-2 card-title card-desc" v-text="article.description"></div>-->
      </v-card-text>

      <!-- Facebook Popup -->
      <b-modal v-bind:id="article.url" header-bg-variant="primary"
               header-text-variant="light">
        <template v-slot:modal-header="{ close }">
          <h5><i class="fab fa-facebook-square fa-lg"></i> Share on Facebook</h5>
        </template>

        <template>
          <textarea style="width: 100%; min-height: 150px;" v-text="article.description"></textarea>
          <img alt="Article Image" :src="article.urlToImage" class="w-100"/>
        </template>

        <template v-slot:modal-footer="{ ok, cancel, hide }">
          <b-dropdown id="dropdown-offset" variant="outline-info" offset="25" size="sm" text="Translate" class="m-2">
            <b-dropdown-item v-for="(language, index_lang) in languages" :key="index_lang"
                             @click.prevent="translate(language.code)">
              {{language.desc}}
            </b-dropdown-item>
          </b-dropdown>
          <b-button size="sm" variant="outline-secondary" @click="cancel()">Cancel</b-button>
          <b-button size="sm" variant="primary" @click="ok(), postToFB(article.description, article.url)">
            Post to Facebook
          </b-button>
        </template>
      </b-modal>
    </v-card>
  </v-hover>
</template>

<script>
    export default {
        name: "article-card",
        props: ['article', 'index'],
        data() {
            return {
                saved: this.article.saved,
                languages: [
                    {code: "en", desc: "English", isActive: false},
                    {code: "es", desc: "Spanish/español", isActive: false},
                    {code: "ar", desc: "Arabic/عربى", isActive: false},
                    {code: "zh", desc: "Chinese/中文", isActive: false}
                ]
            }
        },
        methods: {
            translate: function (language) {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": "d9e003958b7244daa92f6cd96ce39cdb"
                    }
                };

                let currLanguage = this.article.language;
                let url =
                    "https://api-apc.cognitive.microsofttranslator.com/translate?api-version=3.0&from=" +
                    currLanguage +
                    "&to=" +
                    language;
                this.$axios
                    .post(url, [{text: this.article.description}], config)
                    .then(response => {
                        let translated = response.data[0]["translations"];
                        this.$set(this.article, 'description', translated[0].text)
                    })
                    .catch(e => {
                        console.log(e);
                    });
            },

            redirect(url) {
                window.open(url, "_blank");
            },
            saveNews() {
                let user = JSON.parse(localStorage.getItem("user"));
                let jwt = localStorage.getItem("jwt");

                const headers = {
                    'Authorization': 'Bearer ' + jwt
                }

                if (!this.article.saved) {
                    this.$set(this.article, 'saved', true)
                    let data = {
                        "url": this.article.url,
                        "urlToImage": this.article.urlToImage,
                        "title": this.article.title,
                        "description": this.article.description,
                        "user": user.id,
                        "display": true,
                        "uniqueid": user.id + "|" + this.article.url,
                        "language": "en",
                        "publisher": this.article.source.name
                    }

                    this.$axios.post(process.env.baseUrl + "/savedarticles", data,
                        {
                            headers: headers
                        }).then(response => {
                        this.$set(this.article, 'savedid', response.data.id)
                        this.saved = true
                    })

                } else {
                    this.$axios
                        .delete(process.env.baseUrl + "/savedarticles/" + this.article.savedid,
                            {
                                headers: headers
                            })
                    this.$set(this.article, 'saved', false)
                    this.saved = false
                }
            },
            postToFB: function (msg, link) {
                let url = "fb-api/112606970182817/feed";
                const token = "EAAHsGZAfkZA5MBAF3uRKqNZCxRZAMnKZAnHnNCnG8oe1aVTBBzjph3k51ELG4ziQkxqIrJWauL5WA22mwNfpLg7IoYRjJOJSJ3wFZAv8DnCbaWwiGNU1yt9Hi4goRsgt9DCHicqdr7dYar1vCQThI1TAaHBfqcYndBZC0y7xevV5zIL8VnFZANh8rD3OQcwz0ngZD";
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
    }
</script>

<style scoped>
  .overallCard {
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.02), 0px 2px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 5px 0px rgba(0, 0, 0, 0.06);
    display: inline-block;
    height: 100%;
    width: 31%;
  }

  .card-title {
    margin-top: 5px;
    font-weight: 700;
    font-size: 22px;
    height: 140px;
    color: black;
  }

  .card-link {
    height: 100%;
    background-color: whitesmoke;
    color: black;
    font-size: 4vh;
    text-decoration: inherit;
  }

  .card-desc {
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

  .publisher {
    font-weight: 500;
    text-transform: uppercase;
  }

  .articleButton {
    right: 15%;
  }

  .fa-heart {
    color: red;
  }

  @media only screen and (min-width: 300px) and (max-width: 699px) {
    .articleButton {
      right: 22%;
    }
    
    .overallCard {
      width: 100%;
      margin-right: 1rem;
    }
  }

  @media only screen and (min-width: 700px) and (max-width: 1099px) {
    #card-width {
      max-width: 100%;
      margin-right: 1rem;
    }

    .articleButton {
      right: 22%;
    }

    .overallCard {
      width: 47%;
    }
  }

  @media only screen and (min-width: 1100px) and (max-width: 1500px) {
    .articleButton {
      right: 22%;
    }
  }
</style>
