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
		this.enabled = ImageParameters !== undefined
		this._renderToScreen = false
		console.log(renderer)
		this._Buffers = [
			new ShadertoyBufferPass(renderer, ImageParameters, Common),
			new ShadertoyBufferPass(renderer, BufferAParameters, Common),
			new ShadertoyBufferPass(renderer, BufferBParameters, Common),
			new ShadertoyBufferPass(renderer, BufferCParameters, Common),
			new ShadertoyBufferPass(renderer, BufferDParameters, Common)
		]
	}

	get renderToScreen () {
		return this._renderToScreen
	}

	set renderToScreen (val) {
		this._renderToScreen = val
		if (this._Buffers && this.getBuffer(0)) {
			this.getBuffer(0).renderToScreen = val
		}
	}

	render (renderer, writeBuffer, readBuffer) {
		for (let i = this._Buffers.length - 1; i >= 0; i--) {
			if (this.getBuffer(i).enabled) {
				this.getBuffer(i).render(renderer, i === 0 ? writeBuffer : null, readBuffer)
			}
		}
	}

	/**
	 * 设置iChannelx
	 * @param bufferIndex Buffer序号，0：Image，1：BufferA，2：BufferB，3：BufferC，4：BufferD
	 * @param channelIndex iChannel序号
	 * @param value	设置给iChannel的值，现阶段只支持传sampler2D（texture）
	 */
	setIChannel (bufferIndex, channelIndex, value) {
		this.getBuffer(bufferIndex).setChannel(channelIndex, value)
	}

	/**
	 * 为Buffer设置iChannel，如果要使用其它Buffer的渲染结果作为iChannel，应该使用该函数。
	 * 相比于setIChannel函数，该函数能同时设置目标的iChannelTime、iChannelResolution
	 * @param targetBufferIndex 要设置Buffer的序号(0：Image，1：BufferA，2：BufferB，3：BufferC，4：BufferD)
	 * @param targetChannelIndex Buffer要设置的iChannel的序号(0：iChannel0，1：iChannel1，2：iChannel2，3：iChannel3)
	 * @param bufferIndex	作为iChannel的Buffer的序号
	 */
	setIChannelBuffer (targetBufferIndex, targetChannelIndex, bufferIndex) {
		const targetBuffer = this.getBuffer(targetBufferIndex)
		const channelBuffer = this.getBuffer(bufferIndex)
		// 设置targetBuffer的iChannelx输入为channelBuffer的渲染结果
		targetBuffer.setChannel(targetChannelIndex, this.getBufferRenderTarget(bufferIndex).texture)
		// 设置targetBuffer的iChannelTime对应位置的值为channelBuffer的iTime（渲染时长）
		const iChannelTime = targetBuffer.getUniforms('iChannelTime')
		iChannelTime[targetChannelIndex] = channelBuffer.getUniforms('iTime')
		targetBuffer.setUniforms('iChannelTime', iChannelTime)
		// 设置targetBuffer的iChannelResolution对应位置的值为channelBuffer的iResolution
		const iChannelResolution = targetBuffer.getUniforms('iChannelResolution')
		iChannelResolution[targetChannelIndex] = channelBuffer.getUniforms('iResolution')
		targetBuffer.setUniforms('iChannelResolution', iChannelResolution)
	}

	getBuffer (bufferIndex) {
		return this._Buffers[bufferIndex]
	}

	getBufferRenderTarget (bufferIndex) {
		return this.getBuffer(bufferIndex).readBuffer
	}

	setUniforms (bufferIndex, prop, value) {
		return this.getBuffer(bufferIndex).setUniforms(prop, value)
	}

	dispose () {
		super.dispose()
		this._Buffers.forEach(buffer => buffer.dispose())
	}
}
