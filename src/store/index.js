import Vue from 'vue'
import Vuex from 'vuex'
// import router from "@/router";
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex)

export default new Vuex.Store({
    plugins: [createPersistedState()],
    state: {
        jwt: '',
        userID: '',
        userName: '',
        roles: [],
        flashMessages: {
            jwtExpired: false,
        }
    },
    mutations: {
        setJwt(state, payload) {
            state.jwt = payload;
        },
        setUserID(state, payload) {
            state.userID = payload.id;
        },
        addRoles(state, payload) {
            for (const role of payload) {
                state.roles.push(role.slug);
            }
        },
        setUserName(state, payload) {
            state.userName = payload.name;
        },
        resetState(state) {
            state.jwt = 'reset';
            state.userID = '';
            state.userName = '';
            state.roles = [];
            // state.flashMessages.jwtExpired = false;
        },
        jwtExpired(state){
            state.flashMessages.jwtExpired = true;
        },
        resetJwtExpired(state){
            state.flashMessages.jwtExpired = false;
        },
    },
    actions: {
        vuexLogin(state, credentials) {
            return new Promise((resolve, reject) => {
                axios.post("http://jettest.test/api/login", {
                    email: credentials.email,
                    password: credentials.password,
                }).then(response => {
                    state.commit("setJwt", response.data.token);
                    state.commit("setUserID", response.data.user);
                    state.commit("addRoles", response.data.user.roles.data);
                    state.commit("setUserName", response.data.user);
                    state.commit("resetJwtExpired");
                    resolve(response);
                }).catch(function (error) {
                    console.log(error);
                    reject(error);
                });
            })
        },
        vuexLogout(state, reason = '') {
            if(reason === 'expired'){
                state.commit('jwtExpired');
            }

            state.commit('resetState');
        },
        resetJwtExpired(state){
            state.commit("resetJwtExpired");
        },
    },
    modules: {},
    getters: {
        getToken: state => state.jwt,
        getUserID: state => state.userID,
        getRoles: state => state.roles,
        getUserName: state => state.userName,
        getExpired: state => state.flashMessages.jwtExpired,
    },
})
