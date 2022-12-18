<template>
  <div>

    <masthead :heading_image_url="headerImage()"></masthead>

    <div class="container">
      <div class="col-lg-8 col-md-10 mx-auto">

        <b-form @submit="savePost">
          <b-form-group
              label="Header-Image (optional): "
              label-for="headerImageInput"
          >
            <b-form-file
                id="headerImageInput"
                accept="image/*"
                v-model="headerImageFile"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
            ></b-form-file>
          </b-form-group>

          <b-form-group
              label="Title"
              label-for="titleInput">
            <b-form-input
                id="titleInput"
                v-model="title"
                required
                placeholder="Enter Title"
                onkeyUp="document.getElementById('masthead-h1').innerHTML = this.value"></b-form-input>
          </b-form-group>

          <b-form-group label="Body" label-for="bodyInput">
            <ckeditor id="bodyInput" :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
          </b-form-group>

          <b-form-group>
            <b-button type="submit" variant="primary">Post</b-button>
          </b-form-group>

        </b-form>

      </div>
    </div>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Masthead from "@/components/Masthead";
import axios from "axios";
import {mapActions, mapGetters} from "vuex";

export default {

  name: "CreatePost",
  components: {Masthead},
  data() {
    return {
      //CKEditor
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        // The configuration of the editor.
      },

      headerImageFile: null,

      title: '',

      mastheadImageUrl: 'http://jettest.test/storage/01.jpg',
    };
  },
  computed: {
    ...mapGetters({jwt: "getToken", userID: "getUserID", userRoles: "getRoles", userName: "getUserName"})
  },
  created() {
    if (!this.userRoles.includes('admin') ? !this.userRoles.includes('creator') : false) {
      this.$router.push('/blog');
    }
  },
  methods: {
    ...mapActions(['vuexLogout']),
    headerImage() {
      return this.headerImageFile ? URL.createObjectURL(this.headerImageFile) : this.mastheadImageUrl;
    },
    savePost() {

      const formData = new FormData();

      formData.append("image", this.headerImageFile);
      formData.append("title", this.title);
      formData.append("body", this.editorData);

      const config = {
        headers: {
          Authorization: 'Bearer ' + this.jwt,
          'Content-Type': 'multipart/form-data'
        }
      };

      axios.post('http://jettest.test/api/post/store', formData, config)
          .then((response) => {
            console.log(response);
            this.$router.push('/blog');
            this.$emit('flashMessageInfo','You created a new post');
          })
          .catch((error) => {
            console.log(error);
            if(error.response.request.status === 401){
              this.vuexLogout();
            }
          });
    }
  }
}
</script>
