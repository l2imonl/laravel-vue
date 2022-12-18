<template>
  <div id="login">

    <div v-if="!loading" id="description">
      <h2 id="content" v-if="verified">Email verified!</h2>
      <h3 v-if="!verified">Something went wrong. Maybe you are already verified</h3>

      <router-link to="/login">Login</router-link>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Verify",
  data: function () {
    return {
      loading: true,
      signature: '',
      id: '',
      verified: false,
    }
  },
  created() {
    this.signature = this.$route.params.signature;
    this.id = this.$route.params.id;
  },
  mounted() {
    this.verify()
  },

  methods: {
    verify() {
      axios.post('http://jettest.test/api/verify/' + this.signature + '/' + this.id)
          .then((response) => {
            this.loading = false;
            this.verified = true;
            console.log(response);
          })
          .catch((error) => {
            this.loading = false;
            console.log(error);
          });
    },
  },
}
</script>

<style lang="scss">
@import "../assets/styles/Nicelogin";
</style>