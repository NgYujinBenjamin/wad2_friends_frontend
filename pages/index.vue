<template>
  <div class="container-fluid" style="position: relative; z-index:1;">
    <!--    <Carousel class="test" style="position:absolute; z-index:2;"></Carousel>-->
    <div class="main-container" v-if="Object.keys(this.article).length !== 0 && this.article.urlToImage != null"
         v-bind:style="{ 'background-image': 'url(' + this.article.urlToImage + ')' }"></div>
    <div class="box" style="position: relative; z-index:3;"> <!-- style="padding-top: 80px" -->
      <h1 class="title text-center">FRIENDS</h1>
      <p class="text-center">Retrieve news articles from multiple platforms</p>

      <div class="row">
        <div class="col-lg-2" id="bufferCol"></div>
        <!-- Search input field -->
        <div class="col-lg-8 px-2">
          <select v-model="select" class="form-control d-inline align-top float-left" id="language">
            <option disabled value="">Article Language</option>
            <option v-for="(language, index) in languages" v-bind:value="language['desc']">
              {{ language['desc'] }}
            </option>
          </select>
          <b-form-input id="_search" v-on:keyup="validateEnterkey" size="lg"
                        placeholder="Search for articles"></b-form-input>
        </div>
      </div>
      <div class="col-md-12" style="display: flex; justify-content: center;">
        <b-button class="align-self-center" variant="outline-info" style="width: 20%" href="/feed"><b>Latest News</b>
        </b-button>
      </div>

      <div class="news-info" v-if="Object.keys(this.article).length !== 0">
        <p style="color: whitesmoke">Latest Article</p>
        <a :href="this.article.url" target="_blank"><p style="color: whitesmoke; font-weight: 700">
          {{this.article.title.lastIndexOf('-')
          === -1 ? this.article.title : this.article.title.substring(0, this.article.title.lastIndexOf(' - '))}}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
    import Logo from "~/components/Logo.vue";
    // import Carousel from "~/components/Carousel/Carousel.vue";

    export default {
        components: {
            Logo,
           // Carousel
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
                articles: [],
                article: {},
                errStatus: true,
                articleIndex: 0
            };
        },
        methods: {
            async fetchData() {
                let url = "https://newsapi.org/v2/top-headlines?country=sg&apiKey=7b8d0f9048464a8fa74e3edf2c215b8d&pageSize=3";

                const res = await this.$axios.$get(url);
                this.articles = res.articles;
                this.article = res.articles[0];
            },
            changeBtnType: function (index) {
                this.languages[index].isActive = !this.languages[index].isActive;
            },
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
            },
            changeCSS: function () {
                document.querySelector('body').style.overflow = "hidden";
                document.querySelector('html').style.overflow = "hidden";
                document.querySelector('body').style.height = "100%";
                document.querySelector('html').style.height = "100%";
                document.querySelector('body').style.margin = 0;
                document.querySelector('html').style.margin = 0;
                document.querySelector('body').style['background-color'] = "black";
            }
        },
        mounted: function () {
            if (!localStorage.getItem("jwt")) {
              this.$router.replace({ name: "login" });
            }
            else{
              this.fetchData()
              // this.getTrendingTopics()

              this.changeCSS();

              this.$nextTick(function () {
                  window.setInterval(() => {
                      if (this.articles.length > 0) {
                          if (this.articleIndex < 2) {
                              this.articleIndex += 1
                              this.article = this.articles[this.articleIndex]
                          } else {
                              this.articleIndex = 0
                              this.article = this.articles[this.articleIndex]
                          }
                      }
                  }, 10000);
              })
            }
        },
        updated: function () {
            if (this.article === null) {
                this.fetchData()
            }
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
    margin-top: 13%;
  }

  .main-container {
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

  .test {
    top: -300px;
    left: -40px;
    filter: brightness(60%) saturate(140%) blur(8px);
    /* Add the blur effect */
    -webkit-filter: brightness(60%) saturate(140%) blur(8px);
    /* Full height */
    width: 110%;
    height: 110%;
    box-shadow: 0 0 800px rgba(0, 0, 0, 1) inset;
  }

  .logo {
    margin: 2%;
  }


  .title {
    font-weight: 400;
    font-size: 10vh;
    color: white;
    letter-spacing: 1px;
    z-index: 1;
  }

  p {
    letter-spacing: 0.5px;
    font-weight: 300;
    color: white;
  }

  #_search {
    width: 77%;
    background: #fff;
    display: inline-block;
    border: 1px solid #dfe1e5;
    box-shadow: none;
    border-radius: 7px;
    z-index: 3;
    margin-left: 5px;
  }

  .form-control {
    border-radius: 0.4rem;
    font-size: 1rem;
    color: #7b838a;
  }

  #language {
    width: auto;
    height: 100%;
  }

  @media only screen and (max-width: 800px) {
    #bufferCol {
      display: none;
    }

    .box {
      margin-top: 30%;
    }
  }

  @media only screen and (max-width: 450px) {
    #_search {
      width: 99%;
    }

    #language {
      width: auto;
      height: 55%;
      margin-left: 5px;
      margin-bottom: 10px;
      text-align: center;
    }
  }
</style>
