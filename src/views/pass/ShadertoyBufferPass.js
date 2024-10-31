import { Pass, FullScreenQuad } from 'three/addons'
import { ShadertoyMaterial } from '@/views/material/ShadertoyMaterial'

export class ShadertoyBufferPass extends Pass {
	constructor (renderer, parameters, common = undefined) {
		super()
		this.renderer = renderer
		const renderSize = new THREE.Vector2(0, 0)
		renderer.getSize(renderSize)
		this.enabled = parameters !== undefined
		this.writeBuffer = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y, {
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
		})
		this.readBuffer = this.writeBuffer.clone()
		// 兼容three.js其它通道传过来的渲染目标
		const passCommonShader = 'uniform sampler2D tDiffuse;'
		if (this.isEnabled()) {
			if (parameters.uniforms) {
				parameters.uniforms.tDiffuse = { value: null }
			} else {
				parameters.uniforms = {
					tDiffuse: { value: null }
				}
			}
		}
		this.material = new ShadertoyMaterial(parameters, passCommonShader + (common || ''))
		this.fsQuad = new FullScreenQuad(this.material)
	}

	swapBuffers () {
		if (this.needsSwap) {
			const temp = this.readBuffer
			this.readBuffer = this.writeBuffer
			this.writeBuffer = temp
		}
	}

	setSize (width, height) {
		super.setSize(width, height)
		this.writeBuffer.setSize(width, height)
		this.readBuffer.setSize(width, height)
	}

	isEnabled () {
		return this.enabled
	}

	setUniforms (prop, value) {
		this.material.setUniforms(prop, value)
	}

	getChannel (channelIndex) {
		return this.material.getChannel(channelIndex)
	}

	setChannel (channelIndex, value) {
		return this.material.setChannel(channelIndex, value)
	}

	dispose(){
		super.dispose()
		this.writeBuffer.dispose()
		this.readBuffer.dispose()
		this.material.dispose()
		this.fsQuad.dispose()
	}

	render (renderer, writeBuffer, readBuffer) {
		if (!this.isEnabled()) {
			return
		}
		this.setUniforms('tDiffuse', readBuffer.texture)
		renderer.setRenderTarget(this.writeBuffer)
		this.fsQuad.render(renderer)
		if (this.renderToScreen) {
			renderer.setRenderTarget(null)
			this.fsQuad.render(renderer)
		} else {
			renderer.setRenderTarget(writeBuffer)
			if (this.clear) {
				renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil)
			}
			this.fsQuad.render(renderer)
		}
		this.swapBuffers()
	}
}
