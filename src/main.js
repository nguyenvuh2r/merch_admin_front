import { createApp } from 'vue/dist/vue.esm-bundler'
import { createPinia } from 'pinia'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'
import api from './http'
import global from './utils/global'

const app = createApp(App)
const pinia = createPinia()

app.provide('global', global)
app.provide('api', api)

app.use(pinia)
app.use(router)
app.use(Toast, {
    pauseOnFocusLoss: false,
    hideProgressBar: true,
    timeout: 10000,
})
app.mount('#app')
