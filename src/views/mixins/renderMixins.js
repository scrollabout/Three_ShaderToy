import { onMounted, onUnmounted, toValue, useTemplateRef } from 'vue'

export function useRenderMixin (domRefName) {
	const domElement = useTemplateRef(domRefName)
	let renderer = null
	let camera = null

	const override = {
		createRender () {
			const { width, height } = override.getDomSize()
			renderer = new THREE.WebGLRenderer()
			renderer.setPixelRatio(window.devicePixelRatio)
			renderer.setSize(width, height)
			// renderer.toneMapping = THREE.NoToneMapping
			// renderer.toneMappingExposure = 0.5
			domElement.value.appendChild(renderer.domElement)
			renderer.setAnimationLoop(override.render)
		},

		getDomSize () {
			const width = domElement.value ? domElement.value.offsetWidth : 0
			const height = domElement.value ? domElement.value.offsetHeight : 0
			return {
				width,
				height
			}
		},

		onWindowResize () {
			const { width, height } = override.getDomSize()
			camera.aspect = width / height
			camera.updateProjectionMatrix()
			renderer.setSize(width, height)
		},

		render () {
		}
	}

	onMounted(() => {
		window.addEventListener('resize', override.onWindowResize)
		override.createRender()
	})

	onUnmounted(() => {
		window.removeEventListener('mousemove', override.onWindowResize)
		renderer.setAnimationLoop(null)
	})

	return {
		rendererView: domElement,
		renderer,
		camera,
		override,
		...override
	}
}
