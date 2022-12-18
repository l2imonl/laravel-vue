<template>
  <div>
    <b-navbar variant="dark" class="navbar navbar-expand-lg navbar-dark">
      <router-link class="navbar-brand" to="/">
        <font-awesome-icon :icon="'blog'"></font-awesome-icon>
      </router-link>
    </b-navbar>

    <div class="container">

      <vue-confirm-dialog class="confrimDialog"></vue-confirm-dialog>
      <BounceLoader v-if="loadingUsers" :size="'300px'" :color="'#FF4081'"></BounceLoader>
      <b-table v-if="!loadingUsers" striped hover :items="users" :fields="fields">
        <template #cell(roles)="data">

          <div v-for="(role,index) in roles" :key="index">
            <b-button v-if="containsRole(data.item.roles.data,role.name)" :variant="'info'"
                      @click="handleClick(data.item.name,data.item.id,role.name,role.id,'false')">{{ role.name }}
            </b-button>
            <b-button v-if="!containsRole(data.item.roles.data,role.name)" :variant="'outline-info'"
                      @click="handleClick(data.item.name,data.item.id,role.name,role.id,'true')">{{ role.name }}
            </b-button>
          </div>

        </template>
      </b-table>
      <pagination :pagination="pagination" v-on:reload="loadUsers($event)"></pagination>
    </div>

  </div>
</template>

<script>
import BounceLoader from "@/components/loader/BounceLoader";
import Pagination from "@/components/Pagination";
import axios from "axios";
import {mapGetters} from "vuex";

export default {
  name: "UserList",
  components: {Pagination, BounceLoader},
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
      fields: ["id", "name", "email", {key: "roles", label: "roles"}],
      users: [],
      roles: [],
      pagination: {
        currentPage: 1,
        lastPage: '',
        maxVisibleButtons: 3,
      },
      isActive: true,
      loadingUsers: true,
    }
  },
  mounted() {
    this.loadRoles();
    this.loadUsers(this.pagination.currentPage);
  },
  methods: {
    loadUsers(page) {
      this.loadingUsers = true;
      const config = {
        headers: {Authorization: 'Bearer ' + this.$store.state.jwt}
      };
      axios.get('http://jettest.test/api/users?page=' + page, config)
          .then((response) => {
            this.users = response.data.data;
            this.pagination.lastPage = response.data.meta.last_page;
            this.loadingUsers = false;
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    loadRoles() {
      const config = {
        headers: {Authorization: 'Bearer ' + this.$store.state.jwt}
      };
      axios.get('http://jettest.test/api/users/allroles', config)
          .then((response) => {
            this.roles = response.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    containsRole(userRoles, role) {
      if (userRoles) {
        return userRoles.some(item => item.name === role)
      }
      return false;
    },
    handleClick(userName, userID, roleName, roleID, promote) {
      this.$confirm(
          {
            message: promote === 'true' ? 'You want promote ' + userName + ' to ' + roleName + '?' : 'You want demote ' + userName + ' from ' + roleName + '?',
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
                const body = {
                  role_id: roleID,
                  promote: promote,
                };
                const config = {
                  headers: {Authorization: 'Bearer ' + this.$store.state.jwt}
                };
                axios.post('http://jettest.test/api/user/updaterole/' + userID, body, config)
                    .then((response) => {
                      this.$emit("flashMessageInfo","Updated Role: " + userName)
                      console.log(response);
                      this.loadUsers(this.pagination.currentPage);
                    })
                    .catch((error) => {
                      this.$emit("flashMessageError","Something went wrong")
                      console.log(error);
                    });
              }
            }
          }
      )
    },
  }

}
</script>

<style lang="scss">
@import "src/assets/styles/clean-blog/clean-blog.scss";

.confrimDialog {
  box-sizing: border-box;
  font-family: 'Nunito', sans-serif;
}
</style>