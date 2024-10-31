import { useRenderMixin } from '@/views/mixins/renderMixins'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { ShadertoyPass } from '@/views/pass/ShadertoyPass'
import { onMounted, ref, toRaw } from 'vue'

export function useShadertoyRenderMixins (
	domRefName,
	ImageParameters,
	Common = undefined,
	BufferAParameters = undefined,
	BufferBParameters = undefined,
	BufferCParameters = undefined,
	BufferDParameters = undefined
) {
	const renderMixins = useRenderMixin(domRefName)
	let composer = ref(null)
	let shadertoyPass = ref(null)

	onMounted(() => {
		composer.value = new EffectComposer(renderMixins.renderer.value)
		shadertoyPass.value = new ShadertoyPass(
			renderMixins.renderer.value,
			ImageParameters,
			Common,
			BufferAParameters,
			BufferBParameters,
			BufferCParameters,
			BufferDParameters
		)
		shadertoyPass.value.setRenderToScreen(true)
		composer.value.addPass(shadertoyPass.value)
	})

	renderMixins.override.onWindowResize = function () {
		renderMixins.onWindowResize()
		const size = new THREE.Vector2()
		renderMixins.renderer.value.getSize(size)
		composer.value.setSize(size.x, size.y)
	}

	renderMixins.override.render = function () {
		toRaw(composer.value).render()
	}

	return {
		composer,
		shadertoyPass,
		...renderMixins
	}
}
