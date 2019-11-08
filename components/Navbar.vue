<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#" class="navbar-brand">FRIENDS</b-navbar-brand>

      <div class="input-group mobile-searchbar">
        <div class="input-group-prepend">
          <div class="input-group-text">
            <i class="fas fa-search"></i>
          </div>
        </div>
        <input type="text" id="mobilenavbarSearch" v-on:keyup="validateEnterkey" class="form-control" style="height:100%;" aria-label="Text input with checkbox">
        <b-tooltip target="mobilenavbarSearch">Please ensure the search field is filled up!</b-tooltip>
        <b-button size="sm" v-on:click="validate" class=" mx-2 my-2 my-sm-0" variant="outline-light" type="submit" id="searchButton">Search</b-button>
      </div>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav id="headerStyle">
          <b-nav-item href="/">Home</b-nav-item>
          <b-nav-item href="/feed">News Feed</b-nav-item>
          <b-nav-item href="/recommendations">Featured</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
        <!-- Search -->
          <div class="input-group web-searchbar">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <i class="fas fa-search"></i>
              </div>
            </div>
            <input type="text" id="navbarSearch" v-on:keyup="validateEnterkey" class="form-control" style="height:100%;" aria-label="Text input with checkbox">
            <b-tooltip target="navbarSearch">Please ensure the search field is filled up!</b-tooltip>
            <b-button size="sm" v-on:click="validate" class=" mx-2 my-2 my-sm-0" variant="outline-light" type="submit">Search</b-button>
          </div>

          <!-- Language; only show on "News Feed" & -->
          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              <i class="fas fa-globe-americas fa-lg"></i>
              <span>Translate Page</span>
            </template>
            <b-dropdown-item href="#">English</b-dropdown-item>
            <b-dropdown-item href="#">Spanish</b-dropdown-item>
            <!-- <b-dropdown-item v-on:click="getURL()" v-bind:href="currentSearch+'es'">Spanish</b-dropdown-item>
            <b-dropdown-item v-on:click="getURL()" v-bind:href="currentSearch+'ar'">Arabic</b-dropdown-item>
            <b-dropdown-item v-on:click="getURL()" v-bind:href="currentSearch+'zh'">Chinese</b-dropdown-item> -->
          </b-nav-item-dropdown>

          <!-- Profile -->
          <b-nav-item-dropdown right>
            <template v-slot:button-content>
              <i class="fas fa-user-circle fa-lg"></i>
              <span>User</span>
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
      enterKey: false
      // pageURL: this.$route,
      // currentSearch: ""
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("jwt");
      localStorage.removeItem("user");
      this.$router.replace({ name: "login" });
    },
    validate: function() {
      // set default code to be english
      let code = "en";

      let websearch = document.getElementById("navbarSearch");
      let webkeyword = websearch.value;
      let keyword = webkeyword;

      let mobilesearch = document.getElementById("mobilenavbarSearch");
      let mobilekeyword = mobilesearch.value;

      if( mobilekeyword.length > 0){
        keyword = mobilekeyword;
      }

      if (keyword.length > 0) {
        this.errStatus = true;
        keyword = encodeURI(keyword);
        let parameters = "q=" + keyword + "&language=" + code;
        window.location.href = "http://localhost:3000/feed?" + parameters;
      } else {
        this.errStatus = false;
      }
    },
    validateEnterkey: function(e) {
      if (e.keyCode === 13) {
        this.validate();
      }
    }
    // getURL(){
    //   if( this.pageURL["fullPath"].includes("language") ){
    //     this.currentSearch = this.pageURL["fullPath"].split("language=")[0];
    //     this.currentSearch += "language=";
    //   }
    // }
  }
};
</script>

<style scoped>

.input-group-text{
  background-color: white;
  border: none;
}

.form-control{
  border: none;
}

.input-group > .form-control:not(:last-child), .input-group > .custom-select:not(:last-child){
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.mobile-searchbar{
  display: none;
}

@media only screen and (max-width: 800px) {
  .web-searchbar{
    display: none;
  }

  .mobile-searchbar{
    display: flex;
    width: 80%;
  }

  .navbar-brand{
    display: none;
  }
}

@media only screen and (max-width: 450px) {
  .mobile-searchbar{
    width: 70%;
  }

  #searchButton{
    display: none;
  }
}

</style>
