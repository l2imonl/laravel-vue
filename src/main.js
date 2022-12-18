import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueConfirmDialog from 'vue-confirm-dialog'
import BootstrapVue from 'bootstrap-vue'
import FlashMessage from '@smartweb/vue-flash-message'
import CKEditor from '@ckeditor/ckeditor5-vue2'

import { library } from '@fortawesome/fontawesome-svg-core'

import { faEye } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faBlog } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { faStepForward } from '@fortawesome/free-solid-svg-icons'
import { faFastForward } from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEye)
library.add(faEyeSlash)
library.add(faTrash)
library.add(faPencilAlt)
library.add(faBlog)
library.add(faStar)
library.add(faStepForward)
library.add(faFastForward)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(CKEditor);
Vue.use(BootstrapVue);
Vue.use(VueConfirmDialog);
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
Vue.use(FlashMessage);

// Vue.config.errorHandler = (msg, vm, info) => {
//     alert(info)
// }

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
