<template>
  <div class="comments">
    <div v-for="(comment,index) in comments.data" :key="index" class="media">
      <div class=" media media-body px-2">

        <Comment v-on:loadComments="loadComments" v-bind:comment-data="comment"></Comment>

      </div>
    </div>
  </div>

</template>

<script>
import {mapGetters} from "vuex";
import Comment from "@/components/Comment";
import axios from "axios";

export default {
  name: "Comments",
  components: {Comment},
  props: {
    commentData: {},
    postID:{},
  },
  data: function () {
    return {
      comments: this.commentData,
    }
  },
  computed: {
    ...mapGetters({jwt: "getToken"})
  },
  methods: {
    loadComments: function () {
      const config = {
        headers: {Authorization: 'Bearer ' + this.jwt}
      };
      axios.get('http://jettest.test/api/blog/single/' + this.postID + '?replies=true', config)
          .then((response) => {
            this.comments = response.data.comment;
            this.$emit('loadComments');
          })
          .catch(function (error) {
            console.log(error);
          });
    }
  }
}
</script>
