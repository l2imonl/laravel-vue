<template>
  <div>

    <masthead :heading_image_url="mastheadImageUrl"></masthead>

    <div class="container">
      <div class="col-lg-8 col-md-10 mx-auto">

        <div class="form-group">
          <label>Header-Image (optional): </label>

          <input id="image" type="file" name="image" v-on:change="loadFile()">
        </div>

        <div class="form-group">
          <label>Title</label>
          <input v-model="title" type="text" name="title" class="form-control"
                 onkeyUp="document.getElementById('masthead-h1').innerHTML = this.value"/>
        </div>
        <div class="form-group">
          <label>Body</label>
          <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
        </div>
        <div class="form-group">
          <button class="btn btn-lg btn-primary btn-block btn-info" @click="savePost">Post</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Masthead from "@/components/Masthead";
import axios from "axios";
import {mapGetters} from "vuex";

export default {

  name: "EditPost",
  components: {Masthead},
  created() {
    this.postID = this.$route.params.postID;
  },
  data()  {
    return {
      //CKEditor
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        // The configuration of the editor.
      },

      postID: '',

      title: '',

      mastheadImageUrl: 'http://jettest.test/storage/01.jpg',
    };
  },
  computed: {
    ...mapGetters({jwt: "getToken", userID: "getUserID"})
  },
  mounted() {
    this.loadPost();
  },
  methods: {
    loadFile() {
      this.mastheadImageUrl = URL.createObjectURL(event.target.files[0]);
    },
    savePost() {

      const formData = new FormData();
      const imagefile = document.querySelector('#image');

      formData.append("image", imagefile.files[0]);
      formData.append("title", this.title);
      formData.append("body", this.editorData);

      // const body = {
      //   title: this.title,
      //   body: this.editorData,
      //   image: this.mastheadImageUrl,
      // }

      const config = {
        headers: {
          Authorization: 'Bearer ' + this.jwt,
          'Content-Type' : 'multipart/form-data'
        }
      };

      axios.post('http://jettest.test/api/post/updatepost/'+this.postID, formData, config)
          .then((response) => {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error.response.data);
          });
    },
    loadPost(){
      const config = {
        headers: {Authorization: 'Bearer ' + this.jwt}
      };
      axios.get('http://jettest.test/api/blog/single/' + this.postID + '?replies=true', config)
          .then((response) => {
            this.mastheadImageUrl = response.data.post.heading_image_url;
            this.title = response.data.post.title;
            this.editorData = response.data.post.body;
          })
          .catch(function (error) {
            console.log(error);
          });
    },
  }
}
</script>
