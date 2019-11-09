<template>
  <div>
    <b-card
      class="feed-card"
      :img-src="article.urlToImage"
      img-alt="Article Image"
      img-top
      :title="article.title.lastIndexOf(' - ') === -1 ? article.title : article.title.substring(0, article.title.lastIndexOf(' - '))"
    >
      <em class="publisher"
          v-text="article.source.name"></em>

      <div class="f-card-footer">
        <hr>
        <a href="#" @click.prevent="redirect(article.url)" class="card-link d-inline">Read Full Article</a>
        <a href="#" v-b-modal="article.url" class="card-link d-inline float-right"><i
          class="fas fa-share-alt"></i></a>
        <a href="#" class="card-link d-inline float-right" @click.prevent="saveNews()">
          <i :class="this.saved ? 'fas fa-heart' : 'far fa-heart'"></i>
        </a>
      </div>
    </b-card>
    <b-modal v-bind:id="article.url" header-bg-variant="primary"
             header-text-variant="light">
      <template v-slot:modal-header="{ close }">
        <h5><i class="fab fa-facebook-square fa-lg"></i> Share on Facebook</h5>
      </template>

      <template>
        <textarea style="width: 100%; min-height: 150px;" v-text="article.description"></textarea>
        <img alt="Article Image" class="img-fluid" :src="article.urlToImage"/>
      </template>

      <template v-slot:modal-footer="{ ok, cancel, hide }">
        <b-dropdown id="dropdown-offset" variant="outline-info" offset="25" size="sm" text="Translate"
                    class="m-2">
          <b-dropdown-item
            v-for="(language, index_lang) in languages" :key="index_lang"
            @click.prevent="translate(language.code)"
          >{{language.desc}}
          </b-dropdown-item>
        </b-dropdown>
        <b-button size="sm" variant="outline-secondary" @click="cancel()">Cancel</b-button>
        <b-button size="sm" variant="primary" @click="ok(), postToFB(article.description, article.url)">Post to
          Facebook
        </b-button>
      </template>
    </b-modal>
  </div>
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
                const token = "EAAHsGZAfkZA5MBACZB0yMEOj9Cuk8KQYVwzrxl9CERAxbmridPKepZBW3NC5VKv6WkvFWRHy9JIGTaJBmkfZAWuB76CqcVZAWEzHa53aPWP8ZCPdEJyBmcd7nIZCYAMi1MMZB55A65mBoqAOObuodZCZAMcR8uZAylSIPXUfvXjPwYJlGXzsq5OAYiWUPIZC1vOg52bAaod8nMWsp7ILHGFwCK1Hj";
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

  .feed-card {
    height: 440px;
    margin-bottom: 20px;

    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    transition: 0.3s;
  }

  .feed-card:hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.15);
  }

  .card-title {
    font-weight: 700;
    font-size: 22px;
    height: 120px;
  }

  .card-text {
    max-height: 100px;
    overflow: hidden;
    overflow-wrap: break-word;
    text-overflow: ellipsis;
  }

  .card-img-top {
    height: 200px;
    width: auto;
    object-fit: cover;
  }

  .f-card-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px;
  }

  .publisher {
    color: #bdbdbd;
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
  }
</style>
