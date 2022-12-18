<template>

  <div id="login">
    <div id="description">
      <h1>Register</h1>
      <p>Get started with your free account</p>
    </div>
    <div id="form">
      <form @submit.prevent="register">
        <div class="form-group">
          <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>
        </div>
        <label for="name">Name</label>
        <input type="text" id="name" v-model="credentials.name" placeholder="Firstname Lastname" autocomplete="off">
        <label for="email">Email</label>
        <input type="text" id="email" v-model="credentials.email" placeholder="me@example.com" autocomplete="off">
        <label for="password">Password</label>&nbsp;
        <font-awesome-icon :icon="passwordIcon" @click="hidePassword = !hidePassword"></font-awesome-icon>
        <input :type="passwordType" id="password" v-model="credentials.password" placeholder="**********">
        <label for="confirm_password">Confirm Password</label>&nbsp;
        <input :type="passwordType" id="confirm_password" v-model="credentials.confirm_password"
               placeholder="**********">

        <button type="submit" :disabled="loading" @click="message = ''">
          <span v-show="loading" class="spinner-border spinner-border-sm"></span>
          <span>Register</span>
        </button>
        <router-link class="ml-auto" to="/login">Back to login</router-link>
      </form>
    </div>
  </div>

</template>

<script>
import {mapGetters} from "vuex";
import axios from "axios";

export default {
  name: "Register",
  data: function () {
    return {
      credentials: {
        name: "",
        email: "",
        password: "",
        confirm_password: "",
      },
      hidePassword: true,
      message: '',
      loading: false,
    }
  },
  computed: {
    passwordType() {
      return this.hidePassword ? 'password' : 'text'
    },
    passwordIcon() {
      return this.hidePassword ? 'eye-slash' : 'eye'
    },
    ...mapGetters({jwt: "getToken", userID: "getUserID"}),
  },
  created() {

  },
  mounted() {

  },
  methods: {
    register() {
      this.message = '';
      if (this.validate(this.credentials)) {
        this.loading = true;
        const formData = new FormData();
        formData.append("name", this.credentials.name);
        formData.append("email", this.credentials.email);
        formData.append("password", this.credentials.password);

        axios.post('http://jettest.test/api/register', formData)
            .then((response) => {
              this.loading = false;
              console.log(response);
              this.$router.push({name: 'Login'});
              this.$emit("flashMessageInfo","Validation Email was send")
            })
            .catch((error) => {
              this.loading = false;
              console.log(error.response);
              this.message = 'something went wrong';
            });
      }
    },
    validate(credentials) {
      if (!credentials.email) {
        this.message = 'Email is missing';
        return false;
      }
      if (!credentials.email.includes('@')) {
        this.message = 'Invalid Email';
        return false;
      }
      if (!credentials.name) {
        this.message = 'Name is missing';
        return false;
      }
      if (!credentials.password) {
        this.message = 'Password is missing';
        return false;
      }
      if (credentials.password !== credentials.confirm_password) {
        this.message = 'Passwords doesnt match';
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