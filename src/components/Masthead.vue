<template>
  <header class="masthead" id="masthead" v-bind:style="{ backgroundImage: 'url(' + heading_image_url + ')' }">
    <div class="overlay"></div>
    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
          <div class="page-heading">
            <h1 id="masthead-h1">{{ heading }}</h1>
            <span class="subheading">{{ subheading }}</span>
            <span class="meta">{{ meta }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Masthead",
  props: {
    heading: String,
    subheading: {
      type: String,
      default: ''
    },
    meta: String,
    heading_image_url : String,
  },
  data: function () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>