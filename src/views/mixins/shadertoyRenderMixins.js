import { useRenderMixin } from '@/views/mixins/renderMixins'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { ShadertoyPass } from '@/views/pass/ShadertoyPass'

export function useShadertoyRenderMixins (
	domRefName,
	ImageParameters,
	Common = undefined,
	BufferAParameters = undefined,
	BufferBParameters = undefined,
	BufferCParameters = undefined,
	BufferDParameters = undefined
) {
	let { renderer, render, onWindowResize } = useRenderMixin(domRefName)
	const composer = new EffectComposer(renderer)
	const shadertoyPass = new ShadertoyPass(
		renderer,
		ImageParameters,
		Common,
		BufferAParameters,
		BufferBParameters,
		BufferCParameters,
		BufferDParameters
	)
	composer.addPass(shadertoyPass)

	const parentOnWindowResize = onWindowResize
	onWindowResize = function () {
		parentOnWindowResize()
		const size = new THREE.Vector2()
		renderer.getSize(size)
		composer.setSize(size.x, size.y)
	}

	render = function () {
		composer.render()
	}
}
