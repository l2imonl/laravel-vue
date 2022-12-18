<template>

  <div>
    <Masthead :heading="user.name"
              :heading_image_url="'http://jettest.test/storage/02.jpg'"></Masthead>
    <BounceLoader v-if="loading" :size="'300px'" :color="'#FF4081'"></BounceLoader>

    <vue-confirm-dialog class="confirmDialog"></vue-confirm-dialog>

    <div class="container">
      <div class="row">
        <div class="col-lg-8 col-md-10 mx-auto" v-if="!loading">
          <div class="card">
            <div class="card-body">
              <b-form @submit="handleClick(profilePhotoFile,'','')">

                <b-form-group label="Change Photo" label-for="image" class="col-sm-12">
                  <b-avatar :src="profilePhoto()"
                            size="6rem"></b-avatar>
                  <b-form-file
                      id="image"
                      class="mt-2 col"
                      v-model="profilePhotoFile"
                      :state="Boolean(profilePhotoFile)"
                      accept="image/*"
                      placeholder="Choose a file or drop it here..."
                      drop-placeholder="Drop file here..."
                  />

                  <b-form-group v-if="profilePhotoFile">
                    <b-button type="submit" variant="success">Upload</b-button>
                  </b-form-group>
                </b-form-group>

              </b-form>

              <b-form @submit="handleClick(null,form.name,'')">

                <b-form-group label="Change Name" label-for="inputName" class="col-sm-12">
                  <b-input id="inputName" v-model="form.name" :placeholder="user.name"/>
                  <b-button v-if="form.name" type="submit">Change</b-button>
                </b-form-group>

              </b-form>

              <b-form @submit="handleClick(null,'',form.email)">

                <b-form-group label="Change Email" label-for="inputEmail" class="col-sm-12">
                  <b-input type="email" id="inputEmail" v-model="form.email" :placeholder="user.email"/>
                  <b-button v-if="form.email" type="submit">Change</b-button>
                </b-form-group>

              </b-form>
            </div>
          </div>
        </div>
        <div>
        </div>
      </div>
    </div>
    <br>
  </div>

</template>

<script>
import Masthead from "@/components/Masthead";
import axios from 'axios';
import BounceLoader from "@/components/loader/BounceLoader";
import {mapGetters} from "vuex";

export default {
  name: "Profile",
  components: {BounceLoader, Masthead},
  data() {
    return {
      form: {
        name: '',
        email: '',
      },
      profilePhotoFile: null,
      user: {
        name: '',
        email: '',
        profilePhoto: '',
      },
      loading: true,
    }
  },
  computed: {
    ...mapGetters({jwt: "getToken", userID: "getUserID", userRoles: "getRoles", userName: "getUserName"}),
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    profilePhoto() {
      return this.profilePhotoFile ? URL.createObjectURL(this.profilePhotoFile) : this.user.profilePhoto;
    },
    fetchData() {
      this.loading = true;
      const config = {
        headers: {Authorization: 'Bearer ' + this.jwt}
      };
      axios.get('http://jettest.test/api/user/' + this.userID, config)
          .then((response) => {
            console.log(response);
            this.user.name = response.data.data.name;
            this.user.email = response.data.data.email;
            this.user.profilePhoto = response.data.data.profile_photo;
            this.loading = false;
          })
          .catch(function (error) {
            console.log(error);
          });
    },
    updateUser(profilePhotoFile, name, email) {

      const formData = new FormData();

      formData.append("profile_photo", profilePhotoFile);
      formData.append("name", name);
      formData.append("body", email);

      const config = {
        headers: {Authorization: `Bearer ` + this.$store.state.jwt},
      }

      axios.post('http://jettest.test/api/user/update/' + this.userID, formData, config)
          .then((response) => {
            console.log(response);
            this.form.email = '';
            this.form.name = '';
            this.profilePhotoFile = null;
            this.fetchData();
          })
          .catch((error) => {
            console.log(error);
          });
    },
    handleClick(profilePhotoFile, name, email) {
      let message;
      console.log(profilePhotoFile)
      if (profilePhotoFile !== null) {
        message = 'Change ProfilePhoto';
      } else if (name !== '') {
        message = 'Change Name to ' + name + ' ?';
      } else {
        message = 'Change Email to ' + email + ' ?';
      }
      this.$confirm(
          {
            message: message,
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
                this.updateUser(profilePhotoFile, name, email)
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

.confirmDialog {
  box-sizing: border-box;
  font-family: 'Nunito', sans-serif;
}
</style>