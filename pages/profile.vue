<template>
  <div id="profile" class="row">
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
      <div class="h3 ml-3" style="color:rgb(33, 33, 33);">
        <strong>Bookmarked News</strong>
      </div>

      <div v-if="this.savedArticles.length > 0" style="overflow: auto; height: 800px">
        <article-card v-for="article in savedArticles" v-bind:article="article" v-bind:key="article.url"></article-card>
      </div>

      <div v-else>
        <h4 id="noBookmark" class="ml-3 my-3">No news saved</h4>
      </div>
    </div>

  </div>
</template>

<script>
    import changepassword from "~/components/changepassword.vue";
    import ArticleCard from "~/components/feed/article-card";

    export default {
        components: {changepassword, ArticleCard},
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
                ],
                imgSet: require('@/assets/noimageavailable.png')
            };
        },
        mounted: function () {
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
                const articles = await this.$axios.$get("https://sa-api.eof.cx/savedarticles?user=" + userId, {
                    headers: headers
                });

                let _articles = articles;

                for (let i = 0; i < articles.length; i++) {
                    let obj = {"name": articles[i].publisher}
                    _articles[i]["source"] = obj;
                    this.savedArticles.push(_articles[i]);
                }
            },
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

  .overallCard {
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.02), 0px 2px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 5px 0px rgba(0, 0, 0, 0.06);
    display: inline-block;
    height: 400px;
    max-width: 45%;
  }

  .card-title {
    margin-top: 5px;
    font-weight: 700;
    font-size: 22px;
    height: 140px;
    overflow: hidden;
    color: black;
  }

  .card-link {
    height: 100%;
    background-color: rgb(72, 201, 176);
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

  #noBookmark {
    color: #e0e0e0;
    margin-top: 50px;
  }

  span.icon {
    color: black;
  }

  span.text {
    display: inline-block;
  }

  .articleButton {
    right: 20%;
  }

  @media only screen and (max-width: 450px) {
    .articleButton {
      right: 25%;
    }
  }

  @media only screen and (max-width: 800px) {
    #card-width {
      max-width: 100%;
      margin-right: 1rem;
    }

    .articleButton {
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
