import { createApp } from 'vue/dist/vue.esm-bundler'
import { createPinia } from 'pinia'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import Vue3EasyDataTable from 'vue3-easy-data-table'

import App from './App.vue'
import router from './router'
import api from './http'
import global from './utils/global'

import permissions from './directives/permissions'

import CKEditor from '@ckeditor/ckeditor5-vue'

const app = createApp(App)
const pinia = createPinia()

app.provide('global', global)
app.provide('api', api)

app.component('EasyDataTable', Vue3EasyDataTable)

app.use(pinia)
app.use(CKEditor)
app.use(router)
app.use(Toast, {
  pauseOnFocusLoss: false,
  hideProgressBar: true,
  timeout: 10000,
})
app.directive('permissions', permissions)
app.mount('#app')
