<template>
  <div id="profile" class="row" style="height: 94vh;">
    <div class="p-1">
    </div>
    <div class="col-3 p-2" style="background: #e9ecef; box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.02), 0px 2px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 5px 0px rgba(0, 0, 0, 0.06)">
      <div class="h3 mt-5" style="color:rgb(33, 33, 33); padding-left: 38px;">
        <strong>Account Information</strong>
      </div>

      <v-card
        class="v-sheet theme--dark mt-4 mx-auto"
        supportingtext="true"
        color="#48C9B0"
        width="90%"
      >
        <div class="v-card__title">Username</div>
        <div class="v-card__text content">{{username}}</div>
      </v-card>
      <v-card class="v-sheet mt-4 mx-auto" supportingtext="true" width="90%">
        <div class="v-card__title">E-mail address</div>
        <div class="v-card__text content">
          {{email}}
          <button
            class="v-btn v-btn--contained v-btn--rounded theme--dark v-size--x-small float-right"
            size="x-small"
            disabled
          >
            <span class="v-btn__content">
              <span>Verified</span>
            </span>
          </button>
        </div>
      </v-card>
      <v-card class="v-sheet theme--light mt-4 mx-auto" supportingtext="true" width="90%">
        <div class="v-card__title">Password</div>
        <div class="v-card__text">
          <input class="form-control" style="width: 58%; display: initial;" disabled type="password" v-model="password" />        
          <div data-app class="float-right mr-3 pt-3">
            <changepassword />
          </div>
        </div>
      </v-card>
    </div>

    <div class="p-1">
    </div>
    
    <!-- Hardcoded for now, will work on functionality later -->
    <!-- 4 cards per row -->
    <div class="col">
      <div class="h3 ml-3 mt-5" style="color:rgb(33, 33, 33);">
        <strong>Bookmarked News</strong>
      </div>
      <b-card
        title="Card Title"
        img-src="https://picsum.photos/600/300/?image=25"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem; display:inline-block"
        class="mb-2 ml-3 mt-3"
      >
        <b-card-text>
          Some quick example text to build on the card title and make up the bulk of the card's content.
        </b-card-text>

        <b-button href="#" variant="primary">Go somewhere</b-button>
      </b-card>
    </div>
    <!-- End of hardcode -->

  </div>
</template>

<script>
import changepassword from "~/components/changepassword.vue";

export default {
  components: { changepassword },
  name: "profile",
  data() {
    return {
      email: "",
      username: "",
      password: "88888888888888"
    };
  },
  mounted: function() {
    if (!localStorage.getItem("jwt")) {
      this.$router.replace({ name: "login" });
    }
    var user = JSON.parse(localStorage.getItem("user"));
    this.username = user.username;
    this.email = user.email;
  }
};
</script>

<style scoped>
.content{
  font-size: 1rem;
}
.theme--dark.v-btn:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined){
  background-color: #48c9b0;
  color: black;
  font-weight: 700;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.02), 0px 2px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 5px 0px rgba(0, 0, 0, 0.06);
}
.v-card{
  box-shadow:none;
}
</style>