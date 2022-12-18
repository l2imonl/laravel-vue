<template>
  <div class="SinglePost">

    <BounceLoader v-if="loading" :size="'300px'" :color="'#FF4081'"></BounceLoader>

    <Masthead v-if="!loading" :heading="postData.post.title" :meta="postData.post.created_at"
              :heading_image_url="postData.post.heading_image_url"></Masthead>

    <div class="container" v-if="!loading">

      <article>
        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto" v-html="postData.post.body">
          </div>
        </div>


        <div class="row">
          <div class="col-lg-8 col-md-10 mx-auto">
            <h5 class="">Leave a Comment :</h5>
            <post-comment v-on:loadComments="loadComments" v-bind:post-i-d="postData.post.id"></post-comment>
          </div>
        </div>

        <hr/>

        <div class="row">
          <div id="comments" class="col-lg-8 col-md-10 mx-auto rounded"
               style="background-color: rgba(203, 209, 208, 0.25)">
            <Comments v-bind:comment-data="postData.comment" :post-i-d="postID" v-on:loadComments="loadComments"></Comments>
          </div>
        </div>

      </article>

    </div>
  </div>

</template>

<script>
import {mapGetters} from "vuex";
import axios from "axios";
import Masthead from "@/components/Masthead";
import BounceLoader from "@/components/loader/BounceLoader";
import PostComment from "@/components/postComment";
import Comments from "@/components/Comments";

export default {
  name: "SinglePost",
  components: {Comments, PostComment, BounceLoader, Masthead},
  created() {
    this.postID = this.$route.params.postID;
  },
  mounted() {
    this.loadPost();
  },
  data: function () {
    return {
      postID: '',
      loading: true,
      postData: {},
    }
  },
  computed: {
    ...mapGetters({jwt: "getToken", userID:"getUserID"})
  },
  methods: {
    loadPost: function () {
      this.loading = true;
      const config = {
        headers: {Authorization: 'Bearer ' + this.jwt}
      };
      axios.get('http://jettest.test/api/blog/single/' + this.postID + '?replies=true', config)
          .then((response) => {
            this.postData = response.data;
            this.loading = false;
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    loadComments: function () {
      this.loading = true;
      const config = {
        headers: {Authorization: 'Bearer ' + this.jwt}
      };
      axios.get('http://jettest.test/api/blog/single/' + this.postID + '?replies=true', config)
          .then((response) => {
            this.postData.comment = response.data.comment;
            this.loading = false;
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  },
}
</script>