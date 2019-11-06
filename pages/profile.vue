<template>
  <div id="profile">
    <div
      class="v-card v-sheet theme--light mt-5 mx-auto"
      supportingtext="true"
      style="width: 800px;"
    >
      <div class="v-card__title">E-mail address</div>
      <div class="v-card__text">
        {{email}}
        <button
          class="v-btn v-btn--contained v-btn--rounded theme--dark elevation-0 v-size--x-small secondary float-right"
          size="x-small"
          disabled
        >
          <span class="v-btn__content">
            <span>Verified</span>
          </span>
        </button>
      </div>
    </div>
    <div
      class="v-card v-sheet theme--light mt-4 mx-auto"
      supportingtext="true"
      style="width: 800px;"
    >
      <div class="v-card__title">Username</div>
      <div class="v-card__text">{{username}}</div>
    </div>
    <div
      class="v-card v-card--raised v-sheet theme--light mt-4 mx-auto"
      supportingtext="true"
      style="width: 800px;"
    >
      <div class="v-card__title">Password</div>
      <div class="v-card__text">
        {{email}}
        <button
          class="v-btn v-btn--contained v-btn--rounded theme--dark elevation-0 v-size--x-small secondary float-right"
          size="x-small"
         @click="changePassword()">
          <span class="v-btn__content">
            <span>
              <i class="far fa-edit"></i>
            </span>
          </span>
        </button>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "profile",
  data() {
    return {
      email: "benjamin.2017@sis.smu.edu.sg",
      username: "joel",
      password: ""
    };
  },
  methods: {
    changePassword() {

      return false;
    }
  }
  //   mounted: function() {
  //     if (localStorage.getItem("jwt")) {
  //       this.$router.replace({ name: "index" });
  //     }
  //   }
};
</script>

<style scoped>
</style>