import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://www.gabriel.lol',
  crossDomain: true,
  withCredentials: true
});

const app = createApp(App).use(store).use(router)
app.config.globalProperties.$axios = axiosInstance
app.mount('#app');
