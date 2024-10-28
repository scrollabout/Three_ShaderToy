import { createRouter, createWebHashHistory } from 'vue-router'
import shadertoy from './shadertoy'

function setTreeRedirect (tree, parentpath = '') {
	for (let i = 0; i < tree.length; i++) {
		const item = tree[i]
		if (item.children && item.children.length > 0) {
			const childrenMenu = item.children.filter(item => item.path)
			if (childrenMenu.length > 0) {
				const path = `${parentpath ? parentpath : item.path}/${childrenMenu[0].path}`
				item.redirect = {
					path: path
				}
				setTreeRedirect(item.children, path)
			}
		}
	}
	return tree
}

const routes = [
	...setTreeRedirect(shadertoy)
]

const router = createRouter({
	history: createWebHashHistory(process.env.BASE_URL),
	routes
})

export default router
