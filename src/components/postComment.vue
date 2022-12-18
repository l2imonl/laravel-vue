<template>

  <div>
    <div class="form-group">
      <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>
    </div>

    <b-form-textarea name="commentBody" v-model="commentBody" class="form-control" placeholder="Comment..."
                     max-rows="5"></b-form-textarea>
    <button @click="postComment();" :disabled="!isButtonActive"
            class="btn btn-outline-info comment-button">Submit
    </button>
  </div>

</template>

<script>
import {mapGetters} from "vuex";
import axios from "axios";

export default {
  name: "postComment",
  props: ['parentID', 'postID'],
  data: function () {
    return {
      commentBody: '',
      isButtonActive: true,
      message: '',
    }
  },
  computed: {
    ...mapGetters({jwt: "getToken"})
  },
  mounted() {

  },
  methods: {
    loadComments() {
      console.log("loadComments call");
      this.$emit('loadComments');
    },
    postComment: function () {
      this.isButtonActive=!this.isButtonActive;

      if (!this.commentBody) {
        this.message = 'your comment is empty';
        this.isButtonActive = true;
        return;
      }

      let parentID = this.parentID;
      let postID = this.postID;

      const body = {
        body: this.commentBody,
      };

      const config = {
        params: {
          post_id: postID,
          parent_id: parentID,
        },
        headers: {Authorization: `Bearer ` + this.jwt},
      }

      axios.post('http://jettest.test/api/comment/store', body, config)
          .then((res) => {
            console.warn(res);
            this.isButtonActive = !this.isButtonActive;
            this.loadComments();
          })
          .catch(error => {
            console.log(error);
            this.isButtonActive = !this.isButtonActive;
          });
    },
  }
}
</script>
