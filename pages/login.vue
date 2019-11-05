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
        <div class="mt-2">
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
            <button
              class="btn"
              type="password"
              style="position:absolute;right:0px;"
              @click="switchVisibility"
            >
              <i class="far fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="text-center mt-4 mb-3">
          <button class="btn btn-info w-100" @click="login()">Login</button>
          <p class="text-right mt-1">
            <a href="#">Forget password?</a>
          </p>
        </div>

        <div style="height: 20px; border-bottom: 1px solid #616161; text-align: center">
          <span
            style="font-size: 20px; color:#616161; background-color: #F3F5F6; padding: 0 10px;"
          >OR</span>
        </div>
        <p class="text-center mt-4" style="color:#616161;">
          <strong>
            Need an account ?
            <a @click="this.$router.push('/signup')">Sign up here</a>
          </strong>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      passwordFieldType: "password"
    };
  },
  methods: {
    switchVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
    login() {
      this.$axios
        .post(process.env.baseUrl + "/auth/local", {
          identifier: this.username,
          password: this.password
        })
        .then(function(response) {
          localStorage.setItem("jwt", response.data.jwt);
          localStorage.removeItem("errormsg");
        })
        .catch(error => {
          this.$toast.error("Invalid username/password", {
            icon: { name: "exclamation-triangle" }
          });
        })
        .finally(() => {
          if (localStorage.getItem("jwt")) {
            this.$router.push({ name: "index" });
          }
        });
    }
  },
  mounted: function() {
    if (localStorage.getItem("jwt")) {
      this.$router.replace({ name: "index" });
    }
  }
};
</script>

<style scoped>
</style>
