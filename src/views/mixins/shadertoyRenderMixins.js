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
	const composer = ref(null)
	const shadertoyPass = ref(null)
	const renderMixins = useRenderMixin(domRefName)

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
		composer.value.addPass(shadertoyPass.value)
	})

	renderMixins.override.onWindowResize = function () {
		renderMixins.onWindowResize()
		const size = new THREE.Vector2()
		renderMixins.renderer.value.getSize(size)
		composer.value.setSize(size.x, size.y)
	}

	renderMixins.override.render = function () {
		// 不能通过代理进行渲染，必须要获取原始数据才能渲染，toRaw能获取到ref的原始数据
		toRaw(composer.value).render()
	}

	return {
		...renderMixins,
		composer,
		shadertoyPass
	}
}
