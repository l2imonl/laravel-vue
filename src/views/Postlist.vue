<template>
  <div>
    <b-navbar variant="dark" class="navbar navbar-expand-lg navbar-dark">
      <router-link class="navbar-brand" to="/">
        <font-awesome-icon :icon="'blog'"></font-awesome-icon>
      </router-link>
    </b-navbar>

    <div class="container">

      <vue-confirm-dialog></vue-confirm-dialog>
      <BounceLoader v-if="loadingPosts" :size="'300px'" :color="'#FF4081'"></BounceLoader>
      <b-table v-if="!loadingPosts" striped hover :items="blog" :fields="fields">
        <template #cell(icons)="data">
          <router-link :to="{ name: 'Post', params: {postID:data.item.id}}">
            <font-awesome-icon :icon="'eye'"></font-awesome-icon>
          </router-link>

          <font-awesome-icon @click="handleClick(data.item.id)" :icon="'trash'"
                             style="color: #F15156"></font-awesome-icon>

          <router-link :to="{ name: 'editpost', params: {postID:data.item.id}}">
            <font-awesome-icon :icon="'pencil-alt'" style="color: #457B9D"></font-awesome-icon>
          </router-link>
        </template>
      </b-table>
      <pagination v-if="!loading" :pagination="pagination" v-on:reload="loadBlog($event)"></pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Pagination from "@/components/Pagination";
import BounceLoader from "@/components/loader/BounceLoader";
import {mapGetters} from "vuex";

export default {
  name: "Postlist",
  components: {Pagination, BounceLoader},
  mounted() {
    this.loadBlog(this.pagination.currentPage);
  },
  computed: {
    ...mapGetters({jwt: "getToken", userID: "getUserID", userRoles: "getRoles", userName: "getUserName"}),
  },
  created() {
    if (!this.userRoles.includes('admin') ? !this.userRoles.includes('moderator') : false) {
      this.$router.push('/blog');
    }
  },
  data: function () {
    return {
      loadingPosts: true,
      loading: true,
      blog: [],
      pagination: {
        currentPage: 1,
        lastPage: '',
        maxVisibleButtons: 3,
      },
      fields: ["id", "title", "body", {key: "icons", label: " "}],
    }
  },
  methods: {

    handleClick(postToDelete) {
      this.$confirm(
          {
            message: `Are you sure you want to delete Post ` + postToDelete + ' ?',
            button: {
              no: 'No',
              yes: 'Yes'
            },
            /**
             * Callback Function
             * @param {Boolean} confirm
             */
            callback: confirm => {
              if (confirm) {
                const config = {
                  headers: {Authorization: 'Bearer ' + this.jwt}
                };
                axios.delete('http://jettest.test/api/post/delete?id=' + postToDelete, config)
                    .then((response) => {
                      console.log(response);
                      this.loadBlog(this.pagination.currentPage);
                      this.$emit('flashMessageInfo','Deleted Post ' + postToDelete);
                    })
                    .catch((error) => {
                      console.log(error);
                      this.$emit('flashMessageError','Something went wrong')
                    });
              }
            }
          }
      )
    },

    loadBlog: function (page) {
      this.loadingPosts = true;
      const config = {
        headers: {Authorization: 'Bearer ' + this.$store.state.jwt}
      };
      axios.get('http://jettest.test/api/blog?trim=true&user=true&page=' + page, config)
          .then((response) => {
            this.blog = response.data.data;
            this.pagination.lastPage = response.data.meta.last_page;
            this.loadingPosts = false;
            this.loading = false;
          })
          .catch(function (error) {
            console.log(error);
          });
    },
  }
}
</script>
