import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'

export function useRenderMixin (domRefName) {
	const domElement = useTemplateRef(domRefName)
	let renderer = ref(null)
	let camera = ref(null)

	const override = {
		createRender () {
			const { width, height } = override.getDomSize()
			renderer.value = new THREE.WebGLRenderer()
			renderer.value.setPixelRatio(window.devicePixelRatio)
			renderer.value.setSize(width, height)
			// renderer.toneMapping = THREE.NoToneMapping
			// renderer.toneMappingExposure = 0.5
			domElement.value.appendChild(renderer.value.domElement)
		},

		createCamera () {
			const { width, height } = override.getDomSize()
			camera.value = new THREE.PerspectiveCamera(60, width / height)
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
			camera.value.aspect = width / height
			camera.value.updateProjectionMatrix()
			renderer.value.setSize(width, height)
		},

		render () {
		}
	}

	onMounted(() => {
		window.addEventListener('resize', override.onWindowResize)
		override.createRender()
		override.createCamera()
		renderer.value.setAnimationLoop(override.render)
	})

	onUnmounted(() => {
		window.removeEventListener('mousemove', override.onWindowResize)
		renderer.value.setAnimationLoop(null)
	})

	return {
		rendererView: domElement,
		renderer,
		camera,
		override,
		...override
	}
}
