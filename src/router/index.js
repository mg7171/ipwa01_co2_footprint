import {createRouter, createWebHistory} from 'vue-router'
import store from '@/store';
import axios from 'axios';

const routes = [
	{ // Home
		path: '/',
		name: 'Home',
		component: () => import('@/views/Home.vue'),
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router