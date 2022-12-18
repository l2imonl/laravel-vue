<template>
  <div class="Blog">

    <Masthead :heading="'Blog'" :subheading="'Awesome Subheading filler'" :meta="''"
              :heading_image_url="'http://jettest.test/storage/05.jpg'"></Masthead>

    <BounceLoader v-if="loading" :size="'300px'" :color="'#FF4081'"></BounceLoader>

    <div v-if="errorMessage" class="alert alert-danger" role="alert">{{ errorMessage }}</div>

    <div class="container" v-if="!loading">

      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto">
          <article class="post-preview" v-for="(post, index) in blog" :key="index">
            <router-link :to="{ name: 'Post', params: {postID:post.id}}">
              <h2 class="post-title">{{ post.title }}</h2>
              <h3 class="post-subtitle" v-html="post.body"></h3>
            </router-link>
            <p class="post-meta">
              Posted by <strong>{{ post.user.name }}</strong> on
              <strong>{{ post.created_at }}</strong>
            </p>
          </article>
          <hr/>
          <br/>
        </div>
      </div>

      <Pagination :pagination="pagination" v-if="!loading" v-on:reload="loadBlog($event)"></Pagination>

    </div>
  </div>

</template>

<script>
import axios from 'axios';
import Pagination from "@/components/Pagination";
import BounceLoader from "@/components/loader/BounceLoader";
import Masthead from "@/components/Masthead";
import {mapGetters} from "vuex";

export default {
  name: "blog",
  components: {Masthead, BounceLoader, Pagination},
  data: function () {
    return {
      blog: ["id", "title", "body"],
      pagination: {
        currentPage: 1,
        lastPage: '',
        maxVisibleButtons: 3,
      },
      loading: true,
      errorMessage: '',
    }
  },
  computed: {
    ...mapGetters({jwt: "getToken", userID: "getUserID", userRoles: "getRoles", userName: "getUserName"}),
  },
  mounted() {
    this.loadBlog(this.pagination.currentPage);
  }, methods: {
    loadBlog: function (page) {
      this.loading = true;
      const config = {
        headers: {Authorization: 'Bearer ' + this.jwt}
      };
      axios.get('http://jettest.test/api/blog?trim=true&user=true&page=' + page, config)
          .then((response) => {
            this.blog = response.data.data;
            this.pagination.lastPage = response.data.meta.last_page;
            this.loading = false;
          })
          .catch((error) => {
            console.log(error);
          });
    },
  }

}
</script>
