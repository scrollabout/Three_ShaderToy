import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
	{
		path: '/shadertoy',
		component: () => import('@/views/shaderToy/main.vue'),
		redirect: { path: '/shadertoy/users' },
		children: [
			{ path: 'users', component: () => import('@/views/shaderToy/test2.vue') },
			{ path: 'users/:id+', component: () => import('@/views/shaderToy/test3.vue') },
		],
	},
]

const router = createRouter({
	history: createWebHashHistory(process.env.BASE_URL),
	routes
})

export default router
