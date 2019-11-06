<template>
  <div id="Signup" class="container">
    <div class="row">
      <div class="col-4 mb-5"></div>
      <div class="col-4 mt-5">
        <p class="h1 text-center mb-4" style="color:#616161;">
          <strong>Sign Up</strong>
        </p>
        <label for="Email" class="font-weight-bold" style="color:#616161;">Your E-mail address</label>
        <input type="email" v-model="email" id="Email" class="form-control" required />

        <label for="Username" class="font-weight-bold" style="color:#616161;">Your username</label>
        <input v-model="username" id="Username" class="form-control" required />

        <label
          for="Password"
          class="grey-text font-weight-bold d-block mt-2"
          style="color:#616161;"
        >Your password</label>
        <input v-model="password" id="Password" class="form-control" />

        <label
          for="CfmPassword"
          class="grey-text font-weight-bold d-block mt-2"
          style="color:#616161;"
        >Confirm your password</label>
        <input v-model="cfmPassword" id="CfmPassword" class="form-control" />

        <div class="text-center mt-4 mb-3">
          <button class="btn btn-info w-100" @click="signup()">Register</button>
        </div>
        <div style="height: 20px; border-bottom: 1px solid #616161; text-align: center">
          <span
            style="font-size: 20px; color:#616161; background-color: #FFFFFF; padding: 0 10px;"
          >OR</span>
        </div>
        <p class="text-center mt-4" style="color:#616161;">
          <strong>
            Already have an account ?
            <a @click="this.$router.push('/login')">Login here</a>
          </strong>
        </p>
      </div>
      <div class="col"></div>
    </div>
  </div>
</template>
<script>
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

export default {
  name: "Signup",
  data() {
    return {
      email: "",
      username: "",
      password: "",
      cfmPassword: ""
    };
  },
  methods: {
    signup() {
      if (this.checkForm()) {
        this.$axios
          .post(process.env.baseUrl + "/auth/local/register", {
            username: this.username,
            email: this.email,
            password: this.password
          })
          .then(response => {
            localStorage.setItem("jwt", response.data.jwt);
            this.$toast.success("Succussful registration!", {
              icon: { name: "check-circle" }
            });
          })
          .catch(error => {
            this.$toast.error("Something has went wrong....", {
              icon: { name: "bug" }
            });
          })
          .finally(() => {
            if (localStorage.getItem("jwt")) {
              this.$router.replace({ name: "index" });
            }
          });
      } else {
        this.$toast.error("Password and confirm password does not match!", {
          icon: { name: "exclamation-triangle" }
        });
      }
    },
    checkForm() {
      if (this.password != this.cfmPassword) {
        return false;
      }
      return true;
    },
    mounted: function() {
      if (localStorage.getItem("jwt")) {
        this.$router.replace({ name: "index" });
      }
    }
  }
};
</script>

<style scoped>
</style>
