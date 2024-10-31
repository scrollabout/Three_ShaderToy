import { Pass } from 'three/addons'
import { ShadertoyBufferPass } from '@/views/pass/ShadertoyBufferPass'

export class ShadertoyPass extends Pass {
	constructor (
		renderer,
		ImageParameters,
		Common = undefined,
		BufferAParameters = undefined,
		BufferBParameters = undefined,
		BufferCParameters = undefined,
		BufferDParameters = undefined
	) {
		super()
		this.isEnabled = ImageParameters !== undefined
		this._Buffers = [
			new ShadertoyBufferPass(renderer, ImageParameters, Common),
			new ShadertoyBufferPass(renderer, BufferAParameters, Common),
			new ShadertoyBufferPass(renderer, BufferBParameters, Common),
			new ShadertoyBufferPass(renderer, BufferCParameters, Common),
			new ShadertoyBufferPass(renderer, BufferDParameters, Common)
		]
	}

	set renderToScreen (val) {
		if (this._Buffers && this._Buffers[0]) {
			this._Buffers[0].renderToScreen = val
		}
	}

	render (renderer, writeBuffer, readBuffer) {
		for (let i = this._Buffers.length - 1; i >= 0; i--) {
			if (this._Buffers[i].isEnabled()) {
				this._Buffers[i].render(renderer, writeBuffer, readBuffer)
			}
		}
	}

	/**
	 * 设置iChannelx
	 * @param bufferIndex Buffer编号，0：Image，1：BufferA，2：BufferB，3：BufferC，4：BufferD
	 * @param channelIndex iChannel编号
	 * @param value	设置给iChannel的值，现阶段只支持传sampler2D（texture）
	 */
	setIChannel (bufferIndex, channelIndex, value) {
		this._Buffers[bufferIndex].setChannel(channelIndex, value)
	}

	getBuffer (bufferIndex) {
		return this._Buffers[bufferIndex]
	}

	getBufferRenderTarget (bufferIndex) {
		return this.getBuffer(bufferIndex).readBuffer
	}

	getRenderMesh () {
		return this._Buffers[0].fsQuad
	}

	setUniforms (bufferIndex, prop, value) {
		return this._Buffers[bufferIndex].setUniforms(prop, value)
	}

	dispose () {
		super.dispose()
		this._Buffers.forEach(buffer => buffer.dispose())
	}
}
