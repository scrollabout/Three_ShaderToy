import { getContainSize } from '@/views/utils/threeCommon.js'

export default {
	install (Vue) {
		Vue.mixin({
			data () {
				this.resizeHandle = () => {
					this.containSize = getContainSize()
					this.onResize()
				}
				return {
					containId: 'baseTemplate',
					containSize: {},
					animationHanel: null,
					camera: null,
					scene: null,
					renderer: null
				}
			},
			mounted () {
				this.containSize = getContainSize()
				this.init()
				this.animation()
				window.addEventListener('resize', this.resizeHandle)
			},
			beforeDestroy () {
				window.removeEventListener('resize', this.resizeHandle)
				cancelAnimationFrame(this.animationHanel)
				if (this.renderer) {
					delete this.renderer
				}
				if (this.scene) {
					delete this.scene
				}
				if (this.camera) {
					delete this.camera
				}
			},
			methods: {
				init () {

				},
				initProp (sceneBackground = '#ffffff', cameraPosition = new THREE.Vector3(0, 0, 12)) {
					this.scene = new THREE.Scene()
					this.scene.background = new THREE.Color(sceneBackground)

					this.camera = new THREE.PerspectiveCamera(60, this.containSize.width / this.containSize.height, 0.1, 10000)
					this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z)

					this.renderer = new THREE.WebGLRenderer()
					this.renderer.setPixelRatio(window.devicePixelRatio)
					this.renderer.setSize(this.containSize.width, this.containSize.height)

					this.appendToContain()
				},
				appendToContain (renderer = this.renderer) {
					let contain = document.getElementById(this.containId)
					contain.append(renderer.domElement)
				},
				animation () {

				},
				onResize () {

				}
			}
		})
	}
}
