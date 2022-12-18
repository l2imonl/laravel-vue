<template>
  <div id="app">
    <navbar v-on:flashMessageInfo="flashMessageInfo($event)" v-on:flashMessageError="flashMessageError($event)"
            v-if="!noNavbarRoutes.includes($route.name)"></navbar>
    <FlashMessage></FlashMessage>
    <router-view v-on:flashMessageInfo="flashMessageInfo($event)" v-on:flashMessageError="flashMessageError($event)"/>
    <Footer v-if="!noNavbarRoutes"></Footer>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default {
  name: 'App',
  computed: {
    ...mapGetters({jwt: "getToken", userID: "getUserID", userRoles: "getRoles", userName: "getUserName", expired: "getExpired"})
  },
  mounted() {

  },
  components: {
    Footer,
    Navbar,
  },
  data: function () {
    return {
      show: true,
      errorMessage: '',
      noNavbarRoutes: ['Login', 'register', 'verify'],
    }
  },
  methods: {
    ...mapActions(["resetJwtExpired"]),
    //Popup Messages
    flashMessageError(message) {
      this.flashMessage.error({
        title: 'Error',
        message: message,
        blockClass: 'my-flash-message',
      })
    },
    flashMessageInfo(message) {
      this.flashMessage.info({
        title: message,
        blockClass: 'my-flash-message',
      })
    },
  },
  watch:{
    expired(){
      if(this.expired){
        console.log('Route Path: ' + this.$route.path)
        if (this.$route.path !== '/blog'){
          this.$router.push('/blog');
        }
        this.resetJwtExpired();
        this.flashMessageInfo('Your Login is expired');
      }
    },
  },
};
</script>

<style lang="scss">
@import "src/assets/styles/clean-blog/clean-blog.scss";
</style>
