import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
const app = createApp(App);
axios.URL = 'http://localhost:5000';
app.config.globalProperties.$axios = axios;
app.use(router).mount('#app');
