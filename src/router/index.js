import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';
import PricePerHour from '../components/PricePerHour.vue';
import StationInfo from '../components/StationInfo.vue';

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/PricePerHour', component: PricePerHour },
  { path: '/StationInfo', component: StationInfo },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes, 
});

export default router;



