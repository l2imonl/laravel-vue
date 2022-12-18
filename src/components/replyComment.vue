<template>
  <form>
    <div class="form-group">
      <input type="text" name="body" class="form-control"/>
      <!--          <input type="hidden" name="post_id" value="{{ $post_id }}"/>-->
      <input type="hidden" name="comment_id" v-bind:value="commentID"/>
    </div>
    <div class="form-group">
      <input type="submit" class="btn" value="Reply"/>
    </div>
  </form>
</template>

<script>
export default {
  name: "replyComment",
  props:['commentID'],
}
</script>
