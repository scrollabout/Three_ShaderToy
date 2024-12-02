import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export function useRenderMixin (domRefName) {
	const renderMixin = {
		rendererView: useTemplateRef(domRefName),
		renderer: null,
		camera: null,
		cameraControls: null,
		createRender () {
			const { width, height } = renderMixin.getDomSize()
			renderMixin.renderer = new THREE.WebGLRenderer()
			renderMixin.renderer.setPixelRatio(window.devicePixelRatio)
			renderMixin.renderer.setSize(width, height)
			// renderer.toneMapping = THREE.NoToneMapping
			// renderer.toneMappingExposure = 0.5
			renderMixin.rendererView.value.appendChild(renderMixin.renderer.domElement)
		},
		createCamera () {
			const { width, height } = renderMixin.getDomSize()
			renderMixin.camera = new THREE.PerspectiveCamera(60, width / height)
		},
		createCameraControl () {
			renderMixin.cameraControls = new OrbitControls(renderMixin.camera, renderMixin.renderer.rendererView)
		},
		getDomSize () {
			const width = renderMixin.rendererView?.value ? renderMixin.rendererView.value.offsetWidth : 0
			const height = renderMixin.rendererView?.value ? renderMixin.rendererView.value.offsetHeight : 0
			return {
				width,
				height
			}
		},
		onWindowResize () {
			const { width, height } = renderMixin.getDomSize()
			renderMixin.camera.aspect = width / height
			renderMixin.camera.updateProjectionMatrix()
			renderMixin.renderer.setSize(width, height)
		},
		render () {}
	}

	onMounted(() => {
		window.addEventListener('resize', renderMixin.onWindowResize)
		renderMixin.createRender()
		renderMixin.createCamera()
		renderMixin.createCameraControl()
		renderMixin.renderer.setAnimationLoop(renderMixin.render)
	})

	onUnmounted(() => {
		window.removeEventListener('resize', renderMixin.onWindowResize)
		renderMixin.renderer && renderMixin.renderer.setAnimationLoop(null)
	})

	return renderMixin
}
