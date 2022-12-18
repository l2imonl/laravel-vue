<template>
  <div>
    <b-navbar toggleable="lg" class="navbar navbar-expand-lg navbar-light fixed-top mainNav" id="mainNav">
      <div class="container">
        <router-link class="navbar-brand" to="/">FirstLaravel</router-link>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <li class="nav-item">
              <router-link class="nav-link" to="/blog">Blog</router-link>
            </li>
          </b-navbar-nav>

          <b-navbar-nav class="ml-auto">
            <router-link v-if="!userID" to="/login">
              <b-button id="loginButton" variant="outline-light">Login</b-button>
            </router-link>
            <b-nav-item-dropdown v-if="userID" right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <em>{{ userName }}</em>
              </template>
              <b-dropdown-item v-if="showCreatorNavbar" href="#/createpost">CreatePost</b-dropdown-item>
              <hr v-if="showCreatorNavbar">
              <b-dropdown-item v-if="showModeratorNavbar" href="#/postlist">Post List</b-dropdown-item>
              <b-dropdown-item v-if=" showModeratorNavbar" href="#/userList">User List</b-dropdown-item>
              <hr v-if=" showModeratorNavbar">
              <b-dropdown-item href="#/profile">Profile</b-dropdown-item>
              <b-dropdown-item v-on:click="logout" href="#">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>


        </b-collapse>
      </div>

    </b-navbar>
  </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import $ from 'jquery'

export default {
  name: "Navbar",
  fixed: true,
  computed: {
    ...mapGetters({jwt: "getToken", userID: "getUserID", userRoles: "getRoles", userName: "getUserName"}),
    showAdminNavbar() {
      if (this.userID && this.userRoles) {
        return this.userRoles.includes('admin');
      }
      return false;
    },
    showModeratorNavbar() {
      if (this.userRoles && this.userRoles.includes('admin'))
        return true;
      if (this.userID && this.userRoles)
        return this.userRoles.includes('moderator');
      return false;
    },
    showCreatorNavbar() {
      if (this.userRoles && this.userRoles.includes('admin'))
        return true;
      if (this.userID && this.userRoles)
        return this.userRoles.includes('creator');
      return false;
    },
  },
  mounted: function () {
    // Floating label headings for the contact form
    $("body").on("input propertychange", ".floating-label-form-group", function (e) {
      $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function () {
      $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function () {
      $(this).removeClass("floating-label-form-group-with-focus");
    });

    // Show the navbar when the page is scrolled up
    let MQL = 992;

    //primary navigation slide-in effect
    if ($(window).width() > MQL) {
      let headerHeight = $('#mainNav').height();
      $(window).on('scroll', {
            previousTop: 0
          },
          function () {
            let currentTop = $(window).scrollTop();
            let mainNav = $('#mainNav');
            let loginButton = $('#loginButton');
            //check if user is scrolling up
            if (currentTop < this.previousTop) {
              //if scrolling up...
              if (currentTop > 0 && mainNav.hasClass('is-fixed')) {
                mainNav.addClass('is-visible');
              } else {
                mainNav.removeClass('is-visible is-fixed');
              }
            } else if (currentTop > this.previousTop) {
              //if scrolling down...
              mainNav.removeClass('is-visible');
              if (currentTop > headerHeight && !mainNav.hasClass('is-fixed')) mainNav.addClass('is-fixed');
            }
            if (mainNav.hasClass('is-visible') || mainNav.width() < 992) {
              loginButton.addClass('btn-outline-dark');
            } else {
              loginButton.removeClass('btn-outline-dark');
            }
            this.previousTop = currentTop;
          });
    }
  },
  methods: {
    ...mapActions(['vuexLogout']),
    logout() {
      this.vuexLogout();
      this.$emit('flashMessageInfo','you are logged out');
    }
  }
}
</script>

<style>

</style>