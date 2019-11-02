<template>
  <div id="login" class="container">
    <div class="row">
      <div class="col-4 mb-5"></div>
      <div class="col-4 mt-5">
        <p class="h1 text-center mb-4" style="color:#616161;">
          <strong>Sign in</strong>
        </p>
        <label for="LoginUsername" class="font-weight-bold" style="color:#616161;">Your username</label>
        <input type="username" v-model="username" id="LoginUsername" class="form-control" required />
        <br />
        <div>
          <label
            for="LoginPassword"
            class="grey-text font-weight-bold d-block"
            style="color:#616161;"
          >Your password</label>
          <div class="input-group">
            <input
              :type="passwordFieldType"
              v-model="password"
              id="LoginPassword"
              class="form-control w-auto"
            />
            <button class="btn btn-info" type="password" @click="switchVisibility">
              <i :class="[passwordIcon?'far fa-eye':'far fa-eye-slash','fa']"></i>
            </button>
          </div>
        </div>
        <div class="text-center my-4">
          <button class="btn btn-primary">Login</button>
        </div>
        <hr />
        <p class="text-center mt-5" style="color:#616161;">
          <strong>
            Not a user?
            <a href="#">Sign Up Now!</a>
          </strong>
        </p>
      </div>
    </div>
    <!-- <p class="text-center mt-5 text-danger" v-if="showErrorMsg">Invalid username/password</p> -->
  </div>
</template>
<script>
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
// import VueJwtDecode from "vue-jwt-decode";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      passwordFieldType: "password",
      passwordIcon: true
      // showErrorMsg: localStorage.getItem("errormsg")
    };
  },
  methods: {
    switchVisibility() {
      this.passwordIcon = false;
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
    validUsername() {
      return this.username == "" ? false : true;
    },
    login() {
      if (this.validUsername()) {
        // axios
        //   .get(
        //     "https://5d942f4da961920014e930c0.mockapi.io/sso/authorize/1/" +
        //       this.username
        //   )
        //   .then(function(response) {
        //     var token = response.data.response;
        //     var userInfo = JSON.stringify(VueJwtDecode.decode(token));
        //     localStorage.setItem("user", userInfo);
        //     localStorage.setItem("errormsg", "");
        //   })
        //   .catch(error => {
        //     this.showErrorMsg = true;
        //     //eslint-disable-next-line no-console
        //     console.log(error);
        //     localStorage.setItem("errormsg", true);
        //     localStorage.setItem("user", false);
        //   })
        //   .finally(() => {
        //     if (localStorage.getItem("errormsg") != "true") {
        //       this.$router.push({ name: "home" });
        //     }
        //   });
      } else {
        this.showErrorMsg = true;
      }
    }
  }
};
</script>

<style scoped>
</style>
