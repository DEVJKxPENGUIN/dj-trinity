import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import store from './store/store.js'

export const _vue_app = createApp(App)
.use(store)
.mount('#app')



