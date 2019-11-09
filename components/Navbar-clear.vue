<template>
  <div id="nav-design" style="z-index:10;">
    <b-navbar toggleable="lg">
      <b-navbar-brand href="#" class="navbar-brand">FRIENDS</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <i style="color: whitesmoke" class="fas fa-user-circle fa-lg"></i>
              <span style="color: whitesmoke">{{username}}</span>
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

.navbar-light .navbar-brand{
  color: white;
}

#nav-design{
  position: fixed; /* Sit on top of the page content */
  width: 100%; /* Full width (cover the whole page) */
  height: 10%; 
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(#00000094, #0000002e, transparent, transparent, transparent);
}

</style>
