<template>
  <div id="Signup" class="container">
    <div class="row">
      <div class="col-4 mb-5"></div>
      <div class="col-4 mt-5">
        <p class="h1 text-center mb-4" style="color:#616161;">
          <strong>Sign Up</strong>
        </p>
        <label for="LoginUsername" class="font-weight-bold" style="color:#616161;">Your username</label>
        <input type="username" v-model="username" id="LoginUsername" class="form-control" required />
        <label
          for="LoginPassword"
          class="grey-text font-weight-bold d-block mt-2"
          style="color:#616161;"
        >Your password</label>
        <input v-model="password" id="LoginPassword" class="form-control" />
        <label
          for="CfmLoginPassword"
          class="grey-text font-weight-bold d-block mt-2"
          style="color:#616161;"
        >Confirm your password</label>
        <input v-model="password" id="LoginPassword" class="form-control" />
        <div class="text-center mt-4 mb-3">
          <button class="btn btn-info w-100">Register</button>
        </div>
        <div style="height: 20px; border-bottom: 1px solid #616161; text-align: center">
          <span
            style="font-size: 20px; color:#616161; background-color: #F3F5F6; padding: 0 10px;"
          >OR</span>
        </div>
        <p class="text-center mt-4" style="color:#616161;">
          <strong>
            Already have an account ?
            <a href="#">Login here</a>
          </strong>
        </p>
      </div>
    </div>
    <!-- <p class="text-center mt-5 text-danger" v-if="showErrorMsg">Invalid username/password</p> -->
  </div>
</template>
<script>
export default {
  name: "Signup",
  data() {
    return {
      username: "",
      password: "",
      cfmLoginPassword: ""
    };
  },
  methods: {}
};
</script>

<style scoped>
</style>
