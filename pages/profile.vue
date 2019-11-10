<template>
  <div id="profile" class="row">
    <div class="col-xl-3 p-2 leftpanel">
      <div class="h3 ml-4 paneltitle">
        <strong>Account</strong>
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
            style="background-color:#48c9b0"
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
      <div class="h3 paneltitle">
        <strong>Bookmarked News</strong>
      </div>

      <div v-if="this.savedArticles.length > 0" class="row">
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

                // console.log(articles);
                let _articles = articles.reverse();

                for (let i = 0; i < articles.length; i++) {
                    let obj = {"name": articles[i].publisher}
                    _articles[i]["source"] = obj;
                    _articles[i]["saved"] = true;
                    _articles[i]["savedid"] = articles[i].id;
                    this.savedArticles.push(_articles[i]);
                }

                // console.log(this.savedArticles);
            },
        }
    };
</script>

<style scoped>
  .content {
    font-size: 1rem;
  }

  .leftpanel{
    background: whitesmoke; 
  }

  .paneltitle{
    color: rgb(33, 33, 33);
  }

  span.icon {
    color: white;
  }

  span.text {
    display: inline-block;
    padding-right: 3px;
  }

  /* Extra large devices (large laptops and desktops, 1200px and up) */
  @media only screen and (min-width: 1200px) {

  }

  @media only screen and (min-width: 1440px) {
    .overallCard {
      width: 47% !important;
    }

    .articleButton {
      right: 20% !important;
    }
  }

  @media only screen and (min-width: 1900px) {
    .overallCard {
      width: 32% !important;
    }

    .articleButton {
      right: 19% !important;
    }
  }
</style>