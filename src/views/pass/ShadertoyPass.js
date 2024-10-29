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
		this.Common = Common
		this._ImageParameters = _.cloneDeep(ImageParameters)
		this._BufferAParameters = _.cloneDeep(BufferAParameters)
		this._BufferBParameters = _.cloneDeep(BufferBParameters)
		this._BufferCParameters = _.cloneDeep(BufferCParameters)
		this._BufferDParameters = _.cloneDeep(BufferDParameters)
		this._Buffers = [
			new ShadertoyBufferPass(renderer, this._ImageParameters, this.Common),
			new ShadertoyBufferPass(renderer, this._BufferAParameters, this.Common),
			new ShadertoyBufferPass(renderer, this._BufferBParameters, this.Common),
			new ShadertoyBufferPass(renderer, this._BufferCParameters, this.Common),
			new ShadertoyBufferPass(renderer, this._BufferDParameters, this.Common)
		]
		this.Image = this._Buffers[0]
		this.Image.renderToScreen = true
		this.BufferA = this._Buffers[1]
		this.BufferB = this._Buffers[2]
		this.BufferC = this._Buffers[3]
		this.BufferD = this._Buffers[4]
	}

	render (renderer, writeBuffer, readBuffer) {
		this._BufferDParameters && this.BufferD.render()
		this._BufferCParameters && this.BufferC.render()
		this._BufferBParameters && this.BufferB.render()
		this._BufferAParameters && this.BufferA.render()
		this.Image.render()
	}

	/**
	 * 设置iChannelxx
	 * @param bufferIndex Buffer编号，0：Image，1：BufferA，2：BufferB，3：BufferC，4：BufferD
	 * @param channelIndex iChannel编号
	 * @param value	设置给iChannel的值，现阶段只支持传sampler2D（texture）
	 */
	setIChannel (bufferIndex, channelIndex, value) {
		this._Buffers[bufferIndex].setChannel(channelIndex, value)
	}

	getBufferRenderTarget (bufferIndex) {
		return this._Buffers[bufferIndex].readBuffer
	}
}
