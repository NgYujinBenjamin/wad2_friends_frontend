<template>
  <div class="container-fluid">
    <div class="main-container" v-bind:style="{ 'background-image': 'url(' + this.article.urlToImage + ')' }"></div>
    <!-- content -->
    <div class="box">
      <h1 class="title text-center">FRIENDS</h1>
      <p class="text-center">Retrieve news articles from multiple platforms</p>

      <!-- Error message -->
      <div v-bind:class="{'d-none':errStatus}" class="text-center">
        <i><b style="color: red;">Please enter your search term</b></i>
      </div>

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
          <b-form-input id="_search" v-on:keyup="validateEnterkey" size="lg" placeholder="Search for articles"></b-form-input>
        </div>
      </div>
        <!-- Language & Search buttons -->
      <!-- <div class="row">
        <div class="col-lg-2"></div>
        <div class="col-lg-8 px-2 text-center" id="buttons">
          <b-button v-on:click="validate" variant="info" class="searchStyle">Search</b-button>
        </div>
      </div> -->

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
    margin-top: 13%;
  }

  .main-container {;
    content: "";
    position: fixed;
    top: -20px;
    left: -20px;
    z-index: -1;
    display: block;
    filter: brightness(70%) saturate(140%) blur(8px);
    /* Add the blur effect */
    -webkit-filter: brightness(70%) saturate(140%) blur(8px);
    /* Full height */
    width: 110%;
    height: 110%;
    /* Center and scale the image nicely */
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: 0 0 800px rgba(0, 0, 0, 1) inset;
  }

  * {
    font-family: "Open Sans", serif;
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

  .form-control{
    border-radius: 0.4rem;
    font-size: 1rem;
    color: #7b838a;
  }
  
  #language{
    width: auto;
    height: 100%;
  }
  
  @media only screen and (max-width: 800px) {
    #bufferCol{
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

    #language{
      width: auto;
      height: 55%;
      margin-left: 5px;
      margin-bottom: 10px;
      text-align: center;
    }
  }
</style>
