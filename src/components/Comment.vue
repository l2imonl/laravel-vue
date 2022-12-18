<template>
  <div class="comment">
    <h5 class="mt-0">{{ commentData.name }}</h5>
    <!--      hier delete Button für Admin-->

    <!--    <div class="comment-border"></div>-->

    <div class="row">
      <img v-bind:src="commentData.user_profile_pic"
           class=" profile-photo fa-pull-left mx-4 my-auto">
      <p class="col-md" align="left">{{ commentData.body }}</p>
    </div>

    <post-comment v-on:loadComments="loadComments" :parent-i-d="commentData.id"></post-comment>

    <BButton v-if="commentData.replies.data.length" variant="light" :pressed.sync="showReplies" class="comment-button">Replies</BButton>

    <br>

    <div  v-for="(comment,index) in commentData.replies.data" :key="index" class="media md-4 ml-4 rounded"
         style="background-color: rgba(223, 229, 232, 1)">

      <Comment v-if="showReplies" v-on:loadComments="loadComments" v-bind:comment-data="comment" :parent-i-d="commentData.id"></Comment>
    </div>

  </div>
</template>

<script>
import PostComment from "@/components/postComment";

export default {
  name: "Comment",
  components: {PostComment},
  props: ['commentData'],
  data: function () {
    return {
      showReplies: false,
    }
  },
  methods: {
    loadComments() {
      console.log("loadComments call");
      this.$emit('loadComments');
    }
  }
}
</script>

<style scoped>

</style>