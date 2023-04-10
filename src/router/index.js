import {createRouter, createWebHistory} from 'vue-router'
import store from '@/store';
import axios from 'axios';

const routes = [
	{ // Home
		path: '/',
		name: 'Home',
		component: () => import('@/views/Home.vue'),
	},
	{ // About
		path: '/about',
		name: 'About',
		component: () => import('@/views/About.vue'),
	},
	{ // Imprint
		path: '/imprint',
		name: 'Imprint',
		component: () => import('@/views/Imprint.vue'),
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router