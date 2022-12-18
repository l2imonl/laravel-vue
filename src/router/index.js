import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import axios from 'axios';

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
    },
    {
        path: '/blog',
        name: 'Blog',
        alias: '/',
        component: () => import(/* webpackChunkName: "blog" */ '../views/Blog')
    },
    {
        path: '/post/:postID',
        name: 'Post',
        component: () => import(/* webpackChunkName: "singlepost" */ '../views/SinglePost')
    },
    {
        path: '/createpost',
        name: 'createPost',
        component: () => import(/* webpackChunkName: "createpost" */ '../views/CreatePost')
    },
    {
        path: '/editpost/:postID',
        name: 'editpost',
        component: () => import(/* webpackChunkName: "editpost" */'../views/EditPost')
    },
    {
        path: '/postlist',
        name: 'postlist',
        component: () => import(/* webpackChunkName: "postlist" */'../views/Postlist')
    },
    {
        path: '/userlist',
        name: 'userlist',
        component: () => import(/* webpackChunkName: "userlist" */'../views/UserList')
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import(/* webpackChunkName: "profile" */'../views/Profile')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import(/* webpackChunkName: "register" */'../views/Register')
    },
    {
        path: '/verify/:signature/:id',
        name: 'verify',
        component: () => import(/* webpackChunkName: "verify" */'../views/Verify')
    },

]

const router = new VueRouter({
    routes
})

//Handle Unauthorized Access
router.beforeEach((to, from, next) => {
    const loggedIn = store.state.userID;

    if (loggedIn) {
        //Check JWT token
        const config = {
            headers: {Authorization: `Bearer ` + store.state.jwt},
        }
        axios.get('http://jettest.test/api/auth', config)
            .then((response) => {
                console.log('response');
                console.log(response);
                next();
            })
            .catch((error) => {
                console.log('error');
                console.log(error.response);
                if (error.response.request.status === 401) {
                    store.dispatch('vuexLogout','expired');
                }
            })
    } else {
        //check if you have to login
        const publicPages = ['Login', 'Blog', 'Post', 'register', 'verify'];
        const authRequired = !publicPages.includes(to.name);

        if (authRequired) {
            next('/login');
        } else {
            next();
        }
    }
});

export default router