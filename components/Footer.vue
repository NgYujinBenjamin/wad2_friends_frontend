<template>
  <footer style="border-top: 1px solid #efefef; margin-top: 60px">
    <div class="container text-center text-md-left">
      <div class="row">
        <div class="col-md-6 mt-md-0 mt-3">
          <h5 class="text-uppercase">Friends</h5>
        </div>
        <hr class="clearfix w-100 d-md-none pb-3">
        <div class="col-md-3 mb-md-0 mb-3">
        </div>
        <div class="col-md-3 mb-md-0 mb-3">
          <h5>Links</h5>
          <ul class="list-unstyled">
            <li>
              <a href="/feed">Feed</a>
            </li>
            <li>
              <a href="/recommendations">Recommendations</a>
            </li>
            <li>
              <a href="/profile">Profile</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
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
            const user = JSON.parse(localStorage.getItem("user"));
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
  .footer {
    margin-top: 80px;
  }
</style>
