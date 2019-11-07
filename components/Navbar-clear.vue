<template>
  <div>
    <b-navbar toggleable="lg">
      <b-navbar-brand href="#">FRIENDS</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <i class="fas fa-user-circle fa-lg"></i>
              <span>{{username}}</span>
            </template>
            <b-dropdown-item href="/profile">Profile</b-dropdown-item>
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
        data() {
            return {
                articles: [],
                errStatus: true,
                enterKey: false,
                username: ""
            };
        },
        mounted: function () {
            if (!localStorage.getItem("jwt")) {
                this.$router.replace({name: "login"});
            }
            var user = JSON.parse(localStorage.getItem("user"));
            this.username = user.username;
        },
        methods: {
            logout() {
                localStorage.removeItem("jwt");
                localStorage.removeItem("user");
                this.$router.replace({name: "login"});
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
</style>
