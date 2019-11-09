<template>
  <div class="container-fluid">
    <div class="main-container" v-bind:style="{ 'background-image': 'url(' + this.article.urlToImage + ')' }"></div>
    <div class="box">
      <h1 class="title text-center">FRIENDS</h1>
      <p class="text-center">Retrieve news articles from multiple platforms</p>
      <div
        v-bind:class="{'d-none':errStatus}"
        class="text-center"
      >
        <p><i style="color: red;">Please ensure the search field is filled up.</i></p>
      </div>
      <div class="row">
        <div class="col-md-2"></div>
        <div class="col-md-7 px-2">
          <b-form-input id="_search" v-on:keyup="validateEnterkey" size="lg"
                        placeholder="Search for articles"></b-form-input>
        </div>
        <div class="col-md-2 text-left px-0">
          <b-button v-on:click="validate" variant="info" class="searchStyle">Search</b-button>
          <!--          <select v-model="select" class="form-control d-inline" style="height: 100%; width:32%;">-->
          <!--            <option disabled value="">Language</option>-->
          <!--            <option v-for="(language, index) in languages" v-bind:value="language['desc']">-->
          <!--              {{ language['desc'] }}-->
          <!--            </option>-->
          <!--          </select>-->
        </div>
        <div class="col-md-12" style="display: flex; justify-content: center;">
          <b-button class="align-self-center" variant="outline-info" style="width: 20%" href="/feed"><b>Latest News</b></b-button>
        </div>
      </div>

      <div class="news-info" v-if="Object.keys(this.article).length !== 0">
        <p style="color: whitesmoke">Latest Article</p>
        <a :href="this.article.url"><p style="color: whitesmoke; font-weight: 700">{{this.article.title.lastIndexOf('-')
          === -1 ? this.article.title : this.article.title.substring(0, this.article.title.lastIndexOf(' - '))}}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
    import Logo from "~/components/Logo.vue";

    export default {
        components: {
            Logo
        },
        name: "landing",
        data() {
            return {
                select: "",
                languages: [
                    {code: "en", desc: "English", isActive: false},
                    {code: "es", desc: "Spanish/español", isActive: false},
                    {code: "ar", desc: "Arabic/عربى", isActive: false},
                    {code: "zh", desc: "Chinese/中文", isActive: false}
                ],
                article: {},
                errStatus: true,
            };
        },
        methods: {
            async fetchData() {
                let url = "https://newsapi.org/v2/top-headlines?country=us&apiKey=7b8d0f9048464a8fa74e3edf2c215b8d&pageSize=1&domains=channelnewsasia.com,Yahoo.com";

                const res = await this.$axios.$get(url);
                this.article = res.articles[0];
            },
            // async getTrendingTopics() {
            //     const headers = {
            //         'Authorization': 'OAuth oauth_consumer_key="WTS3meCTV0yuYVDGjXIO2Niaa",oauth_token="1168783151339933697-xgbQiWUTEZZ76k85aNNHaaYdGknuzl",oauth_signature_method="HMAC-SHA1",oauth_version="1.0"',
            //     }
            //
            //     let topics = await this.$axios.$get('/twitter-api/1.1/trends/place.json?id=1', {
            //         headers: headers
            //     }).catch(e => {
            //         this.$toast.error("Error: " + e.message, {
            //             icon: {name: "exclamation-triangle"}
            //         });
            //     });
            //
            //     console.log(topics)
            // },
            validate: function () {
                // set default code to be english
                let code = "en";
                let selected = this.select;

                this.languages.forEach(function (lang) {
                    // if (lang.isActive) {
                    //     code = lang.code;
                    // }
                    if (lang.desc === selected) {
                        code = lang.code;
                    }
                });

                let search = document.getElementById("_search");
                let keyword = search.value;

                if (keyword.length > 0) {
                    this.errStatus = true;
                    keyword = encodeURI(keyword);
                    let parameters = "q=" + keyword + "&language=" + code;
                    window.location.href = window.location.href + "feed?" + parameters;
                } else {
                    this.errStatus = false;
                }
            },
            validateEnterkey: function (e) {
                if (e.keyCode === 13) {
                    this.validate();
                }
            }
        },
        mounted: function () {
            if (!localStorage.getItem("jwt")) {
                this.$router.replace({name: "login"});
            }
            this.fetchData()
            // this.getTrendingTopics()
        }
    };
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Open%20Sans');

  body {
    font-family: "Open Sans", serif;
  }

  .news-info {
    background-color: rgba(39, 39, 39, 0.5);
    border-radius: 5px;
    padding: 20px 20px;
    position: fixed;
    bottom: 100px;
    right: 100px;
    width: 500px;
  }

  .box {
    margin-top: 10%;
  }

  .main-container {;
    content: "";
    position: fixed;
    top: -20px;
    left: -20px;
    z-index: -1;
    display: block;
    filter: brightness(40%) saturate(140%) blur(8px);
    /* Add the blur effect */
    -webkit-filter: brightness(40%) saturate(140%) blur(8px);
    /* Full height */
    width: 110%;
    height: 110%;
    /* Center and scale the image nicely */
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;

    box-shadow: 0 0 800px rgba(0, 0, 0, 1) inset;

  }

  .title {
    font-family: "Open Sans", serif;
    display: block;
    font-weight: 400;
    font-size: 100px;
    color: whitesmoke;
    letter-spacing: 1px;
  }

  p {
    font-family: "Open Sans", serif;
    letter-spacing: 0.5px;
    font-weight: 300;
    color: whitesmoke;
  }

  #_search {
    width: 100%;
    background: #fff;
    display: flex;
    border: 1px solid #dfe1e5;
    box-shadow: none;
    border-radius: 7px;
    z-index: 3;
    margin: 0 auto;
  }

  #language {
    margin-right: 130px;
  }

  .searchStyle {
    height: 100%;
  }
</style>
