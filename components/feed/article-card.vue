<template>
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

    <b-card-text v-text="article.description" style="padding-top:7px;"></b-card-text>
    <hr>
    <div class="card-text">
      <a href="#" @click.prevent="redirect(article.url)" class="card-link d-inline">Read Full Article</a>
      <a href="#" v-b-modal="'myModal' + index" class="card-link d-inline float-right"><i
        class="fas fa-share"></i></a>
      <a href="#" class="card-link d-inline float-right" @click.prevent="saveNews()">
        <i :class="this.saved ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
      </a>
    </div>

    <b-modal v-bind:id="'myModal'+index" :title="'Article '+index" header-bg-variant="primary"
             header-text-variant="light">
      <template v-slot:modal-header="{ close }">
        <h5><i class="fab fa-facebook-square fa-lg"></i> Share on Facebook</h5>
      </template>

      <template>
        <textarea style="width: 100%; min-height: 150px;" v-text="article.description"></textarea>
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
</template>

<script>
    export default {
        name: "article-card",
        props: ['article', 'index'],
        data() {
            return {
                saved: this.article.saved
            }
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
    }
</script>

<style scoped>
  .publisher {
    color: #bdbdbd;
    font-weight: 500;
    text-transform: uppercase;
  }
</style>
