import { useRenderMixin } from '@/views/mixins/renderMixins'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { ShadertoyPass } from '@/views/pass/ShadertoyPass'
import { onMounted, reactive, ref, toRaw } from 'vue'
import { OutputPass } from 'three/addons'

export function useShadertoyRenderMixins (
	domRefName,
	ImageParameters,
	Common = undefined,
	BufferAParameters = undefined,
	BufferBParameters = undefined,
	BufferCParameters = undefined,
	BufferDParameters = undefined
) {
	const shadertoyRenderMixins = {
		composer: null,
		shadertoyPass: null,
		renderMixins: useRenderMixin(domRefName)
	}

	onMounted(() => {
		shadertoyRenderMixins.composer = new EffectComposer(shadertoyRenderMixins.renderMixins.renderer)
		shadertoyRenderMixins.shadertoyPass = new ShadertoyPass(
			shadertoyRenderMixins.renderMixins.renderer,
			ImageParameters,
			Common,
			BufferAParameters,
			BufferBParameters,
			BufferCParameters,
			BufferDParameters
		)
		shadertoyRenderMixins.composer.addPass(shadertoyRenderMixins.shadertoyPass)
		shadertoyRenderMixins.composer.addPass(new OutputPass())
	})

	shadertoyRenderMixins.renderMixins.onWindowResize = function () {
		const { width, height } = shadertoyRenderMixins.renderMixins.getDomSize()
		shadertoyRenderMixins.renderMixins.camera.aspect = width / height
		shadertoyRenderMixins.renderMixins.camera.updateProjectionMatrix()
		shadertoyRenderMixins.renderMixins.renderer.setSize(width, height)
		shadertoyRenderMixins.composer.setSize(width, height)
	}

	shadertoyRenderMixins.renderMixins.render = function () {
		// 不能通过代理进行渲染，必须要获取原始数据才能渲染，toRaw能获取到ref的原始数据
		toRaw(shadertoyRenderMixins.composer).render()
	}

	return shadertoyRenderMixins
}
