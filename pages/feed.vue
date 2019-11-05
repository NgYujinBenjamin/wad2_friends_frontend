<template>
  <no-ssr>
    <masonry :cols="4" :gutter="30">
      <div v-for="(article, index) in articles" :key="index">
        <b-card class="feed-card" :img-src="article.urlToImage" img-alt="Article Image" img-top :title="article.title">
          <b-card-text v-text="article.description" v-model="index"></b-card-text>

          <div class="row mx-1">
            <a href="#" @click.prevent="redirect(article.url)" class="card-link d-inline pull-left">
              Read Full Article
            </a>
            <b-button v-b-modal="'myModal' + index" class="card-link d-inline pull-right" variant="success" size="sm">
              Share
            </b-button>
          </div>

          <b-modal v-bind:id="'myModal'+index" :title="'Article '+index">

            <template v-slot:modal-header="{ close }">
              <!-- Emulate built in modal header close button action -->
              <h6>{{article.title}}</h6>
            </template>

            <template>
              <b-card-text v-text="article.description" v-model="index"></b-card-text>
              <img alt="Article Image" :src="article.urlToImage" class="w-100"/>
            </template>

            <template v-slot:modal-footer="{ ok, cancel, hide }">
              <b-dropdown id="dropdown-offset" offset="25" size="sm" text="Translate" class="m-2">
                <b-dropdown-item v-for="language in languages" @click.prevent="translate(index,language.code)">
                  {{language.desc}}
                </b-dropdown-item>
                <!--                <option v-model="selected" v-for="language in languages" :value="language.code">{{language.desc}}</option>-->
              </b-dropdown>

              <b-button size="sm" variant="danger" @click="cancel()">
                Cancel
              </b-button>

              <b-button size="sm" variant="success" @click="ok()">
                Post
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
  </no-ssr>
</template>

<script>
    export default {
        name: "feed",
        components: {},
        data() {
            return {
                articles: [],
                languages: [
                    {code: "en", desc: "English", isActive: false},
                    {code: "es", desc: "Spanish/español", isActive: false},
                    {code: "ar", desc: "Arabic/عربى", isActive: false},
                    {code: "zh", desc: "Chinese/中文", isActive: false}
                ]
            }
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
            let currURL = document.location.href;
            let params = currURL.split("?");
            // console.log("params", params, params.length);
            let language = "en";
            let url = "";

            // check if there is any parameters from index.vue
            if (params.length > 1) {
                language = params[1].split("language=")[1];
                params = params[1];
                url = 'https://newsapi.org/v2/everything?apiKey=7b8d0f9048464a8fa74e3edf2c215b8d&' + params;
            } else {
                // if feed page is visited directly without any parameters
                // use the headlines url instead
                url = "https://newsapi.org/v2/top-headlines?country=sg&apiKey=7b8d0f9048464a8fa74e3edf2c215b8d";
            }
            
            // console.log(params,language);
            this.fetchData(url, language);
        },
        methods: {
            translate: function (index, language) {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Ocp-Apim-Subscription-Key': 'd9e003958b7244daa92f6cd96ce39cdb'
                    }
                };

                let currLanguage = this.articles[index].language;
                let url = 'https://api-apc.cognitive.microsofttranslator.com/translate?api-version=3.0&from=' + currLanguage + '&to=' + language;
                this.$axios.post(url,
                    [
                        {"text": this.articles[index].description}
                    ], config
                ).then(response => {
                        let translated = response.data[0]['translations'];
                        this.articles[index].description = translated[0].text;
                        this.articles[index].language = language;
                        // console.table(translated[0].text, language, currLanguage);
                    }
                ).catch(e => {
                    console.log(e);
                })
            },
            redirect(url) {
                // console.log(url);
                window.open(url, '_blank');
            },
            async fetchData(url, language) {
                const res = await this.$axios.$get(url);
                this.articles = res.articles;

                for (let i = 0; i < this.articles.length; i++) {
                    // set the language property for each article for translation use later on
                    this.articles[i].language = language;
                }

            }
        }
      };

      let url =
        "https://api-apc.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=" +
        language;
      this.$axios
        .post(url, [{ text: description }], config)
        .then(response => {
          let translated = response.data[0]["translations"];
          alert(JSON.stringify(translated));
        })
        .catch(e => {
          console.log(e);
        });
    },
    async fetchData(url) {
      const res = await this.$axios.$get(url);
      // console.log(typeof res);
      console.log(res.articles);
      this.articles = res.articles;
    }
  },
  mounted: function() {
    if (!localStorage.getItem("jwt")) {
      this.$router.replace({ name: "login" });
    }
  }
};
</script>

<style scoped>
.feed-card {
  margin-bottom: 10px;
}
</style>
