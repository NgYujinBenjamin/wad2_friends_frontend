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
        <div class="col-md-3 text-left px-0">
          <select v-model="select" class="form-control d-inline" style="height: 100%; width:32%;">
            <option disabled value="">Select Language</option>
            <option v-for="(language, index) in languages" v-bind:value="language['desc']">
              {{ language['desc'] }}
            </option>
          </select>
          <b-button v-on:click="validate" variant="info" class="searchStyle w-25 align-top">Search</b-button>
        </div>
      </div>
      <!--      <div id="language" class="text-center pt-5">-->
      <!--        <p style="margin-bottom: -15px">Languages</p>-->
      <!--        <b-button-->
      <!--          v-for="(language, index) in languages" :key="index"-->
      <!--          v-on:click="changeBtnType(index)"-->
      <!--          class="my-4 d-inline mx-1"-->
      <!--          variant="info"-->
      <!--          v-bind:class="{'active':language['isActive']}"-->
      <!--          v-text="language['desc']"-->
      <!--          style="margin: 0"-->
      <!--        ></b-button>-->
      <!--      </div>-->
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
            // changeBtnType: function (index) {
            //     this.languages[index].isActive = !this.languages[index].isActive;
            // },
            validate: function () {
                // set default code to be english
                let code = "en";
                let selected = this.select;

                this.languages.forEach(function (lang) {
                    // if (lang.isActive) {
                    //     code = lang.code;
                    // }
                    if(lang.desc == selected){
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
        }
    };
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Open%20Sans');

  body {
    background-color: #272727;
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

  .logo {
    margin: 2%;
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

  select{
    appearance: "caret";
  }
</style>
