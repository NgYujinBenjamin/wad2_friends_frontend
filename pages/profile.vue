<template>
  <div id="profile">
    <p class="h2 text-center mt-5" style="color:#616161;">
      <strong>User details</strong>
    </p>

    <v-card
      class="v-sheet theme--dark mt-4 mx-auto"
      supportingtext="true"
      style="width: 800px;"
      color="#48C9B0"
    >
      <div class="v-card__title">Username</div>
      <div class="v-card__text">{{username}}</div>
    </v-card>
    <v-card class="v-sheet mt-4 mx-auto" supportingtext="true" style="width: 800px;">
      <div class="v-card__title">E-mail address</div>
      <div class="v-card__text">
        {{email}}
        <button
          class="v-btn v-btn--contained v-btn--rounded theme--dark v-size--x-small float-right"
          size="x-small"
          color="primary"
          disabled
        >
          <span class="v-btn__content">
            <span>Verified</span>
          </span>
        </button>
      </div>
    </v-card>
    <v-card class="v-sheet theme--light mt-4 mx-auto" supportingtext="true" style="width: 800px;">
      <div class="v-card__title">Password</div>
      <div class="v-card__text">
        <input type="password" v-model="password" />
        <div data-app class="float-right mr-4">
          <changepassword />
        </div>
      </div>
    </v-card>
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
</style>