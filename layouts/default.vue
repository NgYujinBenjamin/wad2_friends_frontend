<template>
  <div>
    <navbar-clear v-if="this.$route.fullPath === '/'"></navbar-clear>
    <navbar style="margin-bottom: 20px" v-else></navbar>
    <div v-if="this.$route.fullPath !== '/'" class="container">
      <nuxt/>
    </div>
    <nuxt v-else/>
    <f-footer v-if="this.$route.fullPath !== '/'"></f-footer>
  </div>
</template>

<style>
  html {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
  }

  .button--green {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #3b8070;
    color: #3b8070;
    text-decoration: none;
    padding: 10px 30px;
  }

  .button--green:hover {
    color: #fff;
    background-color: #3b8070;
  }

  .button--grey {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #35495e;
    color: #35495e;
    text-decoration: none;
    padding: 10px 30px;
    margin-left: 15px;
  }

  .button--grey:hover {
    color: #fff;
    background-color: #35495e;
  }
</style>
<script>
    import Navbar from "~/components/Navbar";
    import NavbarClear from "~/components/Navbar-clear";
    import FFooter from "~/components/Footer";

    export default {
        components: {
            Navbar,
            NavbarClear,
            FFooter
        }
    }
</script>
