<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">FRIENDS</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav id="headerStyle">
          <b-nav-item href="/">Home</b-nav-item>
          <b-nav-item href="/feed">News Feed</b-nav-item>
          <!--<b-nav-item href="#" disabled>Disabled</b-nav-item>-->
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <div class="input-group">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <i class="fas fa-search"></i>
              </div>
            </div>
            <input
              type="text"
              class="form-control"
              style="height:100%;"
              aria-label="Text input with checkbox"
            />
            <b-button
              size="sm"
              class="mx-2 my-2 my-sm-0"
              variant="outline-light"
              type="submit"
            >Search</b-button>
          </div>

          <!-- <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>-->

          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              <i class="fas fa-globe-americas fa-lg"></i>
              <span>Lang</span>
            </template>
            <b-dropdown-item href="#">EN</b-dropdown-item>
            <b-dropdown-item href="#">ES</b-dropdown-item>
            <b-dropdown-item href="#">RU</b-dropdown-item>
            <b-dropdown-item href="#">FA</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <i class="fas fa-user-circle fa-lg"></i>
              <span>User</span>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="#" @click="logout()">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import "@fortawesome/fontawesome-free/css/all.css";
export default {
  name: "navbar",
  methods: {
    logout() {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      this.$router.replace({ name: "login" });
    }
  }
};
</script>

<style scoped>
</style>
