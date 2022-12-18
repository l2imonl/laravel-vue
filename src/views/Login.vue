<template>
  <div id="login">
    <div id="description">
      <h1>Login</h1>
      <p>By logging in you agree to the ridiculously long terms that you didn't bother to read.</p>
      <p>
        <router-link to="/blog">Or head over to the Blog</router-link>
      </p>
    </div>
    <div id="form">
      <form @submit.prevent="login">
        <div class="form-group">
          <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>
        </div>
        <label for="email">Email</label>
        <input type="text" id="email" v-model="credentials.email" placeholder="me@example.com" autocomplete="off">
        <label for="password">Password</label>
        <font-awesome-icon :icon="passwordIcon" @click="hidePassword = !hidePassword"></font-awesome-icon>
        <input :type="passwordType" id="password" v-model="credentials.password" placeholder="**********">

        <button type="submit" :disabled="loading" @click="errorMessage = ''">
          <span v-show="loading" class="spinner-border spinner-border-sm"></span>
          <span>Log in</span>
        </button>
        <router-link to="/register">Register</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "login",
  data: function () {
    return {
      credentials: {
        email: "",
        password: ""
      },
      hidePassword: true,
      errorMessage: '',
      loading: false,
    }
  },
  computed: {
    ...mapGetters({jwt: "getToken", userID: "getUserID", userRoles: "getRoles", userName: "getUserName"}),
    passwordType() {
      return this.hidePassword ? 'password' : 'text'
    },
    passwordIcon() {
      return this.hidePassword ? 'eye-slash' : 'eye'
    },
  },
  created() {
    if (this.$route.params.message)
      this.errorMessage = this.$route.params.message;
    if (this.userID) {
      this.$router.push('/blog');
    }
  },
  mounted() {
  },
  methods: {
    ...mapActions(["vuexLogin"]),
    login: function () {
      if (this.validate(this.credentials)) {
        this.loading = true;
        this.$store.dispatch('vuexLogin', this.credentials).then(() => {
          if (this.userID){
            this.$router.push('/blog');
          }
        }, error => {
          console.log(error);
          this.loading = false;
          this.errorMessage = 'Wrong Login';
        });
      }
    },
    validate(credentials) {
      if (!credentials.email) {
        this.errorMessage = 'Email is missing';
        return false;
      }
      if (!credentials.email.includes('@')) {
        this.errorMessage = 'Invalid Email';
        return false;
      }
      if (!credentials.password) {
        this.errorMessage = 'Password is missing';
        return false;
      }
      return true;
    }
  }
}
</script>

<style lang="scss">
@import "../assets/styles/Nicelogin";
</style>
