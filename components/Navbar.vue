<template>
  <div style="height: 72px; border-bottom: 1px solid #efefef; z-index: 9999">
    <div class="container">
      <b-navbar id="navbar" toggleable="lg" style="background: white !important;" variant="light" type="light">
        <b-navbar-brand href="/">FRIENDS</b-navbar-brand>

        <input type="text" width="200px" id="navbarSearch" v-on:keyup="validateEnterkey" placeholder="Search"
               v-if="username !== ''">

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <!-- Right aligned nav items -->
        <b-collapse id="nav-collapse" is-nav v-if="username !== ''">
          <b-navbar-nav class="ml-auto">
            <b-navbar-nav id="headerStyle">
              <b-nav-item href="/feed">Feed</b-nav-item>
              <b-nav-item href="/featured">Featured</b-nav-item>
            </b-navbar-nav>

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <i class="fas fa-user-circle fa-lg"></i>
                <span>{{username}}</span>
              </template>
              <b-dropdown-item href="/profile">Profile</b-dropdown-item>
              <b-dropdown-item href="/login" @click="logout()">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
  </div>
</template>

<script>
    import "@fortawesome/fontawesome-free/css/all.css";

    export default {
        name: "navbar",
        data() {
            return {
                articles: [],
                errStatus: true,
                enterKey: false,
                username: ""
            };
        },
        mounted: function () {
            if (!localStorage.getItem("jwt") && this.$route.fullPath !== "/signup") {
                this.$router.replace({name: "login"});
            }
            if (localStorage.getItem("user")) {
                const user = JSON.parse(localStorage.getItem("user"));
                this.username = user.username;
            }
        },
        methods: {
            logout() {
                localStorage.removeItem("jwt");
                localStorage.removeItem("user");
                // this.$router.replace({name: "login"});
            },
            validate: function () {
                // set default code to be english
                let code = "en";

                let search = document.getElementById("navbarSearch");
                let keyword = search.value;

                if (keyword.length > 0) {
                    this.errStatus = true;
                    keyword = encodeURI(keyword);
                    let parameters = "q=" + keyword + "&language=" + code;
                    window.location.href = "http://localhost:3000/feed?" + parameters;
                } else {
                    this.errStatus = false;
                }
            },
            validateEnterkey: function (e) {
                if (e.keyCode === 13) {
                    this.validate();
                }
            }
        }
    };
</script>

<style scoped>
  *{
    position: relative;
  }

  #navbar{
    position: relative;
    top: -11px;
  }

  #navbarSearch {
    border: 1px solid rgba(0, 0, 0, .06);
    box-shadow: 0 1px 3px rgba(0, 0, 0, .07), 0 1px 2px rgba(0, 0, 0, .07);
    height: 42px;
    border-radius: 4px;
    font-size: 17px;
    padding: 0 16px;
    line-height: 2;
    color: rgba(0, 0, 0, .6);
  }

</style>
