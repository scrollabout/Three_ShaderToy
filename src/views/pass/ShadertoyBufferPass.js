import { Pass, FullScreenQuad } from 'three/addons'
import { ShadertoyMaterial } from '@/views/material/ShadertoyMaterial'

export class ShadertoyBufferPass extends Pass {
	constructor (renderer, parameters, common = undefined) {
		super()
		this.renderer = renderer
		const renderSize = new THREE.Vector2(0, 0)
		renderer.getSize(renderSize)
		this.writeBuffer = new THREE.WebGLRenderTarget(renderSize.x, renderSize.y, {
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
		})
		this.readBuffer = this.writeBuffer.clone()
		this.material = new ShadertoyMaterial(parameters, common)
		this.fsQuad = new FullScreenQuad(this.material)
	}

	swapBuffers () {
		const temp = this.readBuffer
		this.readBuffer = this.writeBuffer
		this.writeBuffer = temp
	}

	setSize (width, height) {
		super.setSize(width, height)
		this.writeBuffer.setSize(width, height)
		this.readBuffer.setSize(width, height)
	}

	getChannel (channelIndex) {
		return this.material.getChannel(channelIndex)
	}

	setChannel (channelIndex, value) {
		return this.material.setChannel(channelIndex, value)
	}

	render () {
		if (this.renderToScreen) {
			this.renderer.setRenderTarget(null)
			this.fsQuad.render(this.renderer)
		} else {
			this.renderer.setRenderTarget(this.writeBuffer)
			if (this.clear) {
				this.renderer.clear(this.renderer.autoClearColor, this.renderer.autoClearDepth, this.renderer.autoClearStencil)
			}
			this.fsQuad.render(this.renderer)
			this.swapBuffers()
		}
	}
}
