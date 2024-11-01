import dayjs from 'dayjs'
import vertex from '@/views/shaders/ShadertoyMaterial/vertex.glsl'

export class ShadertoyMaterial extends THREE.ShaderMaterial {
	static get type () {
		return 'ShadertoyMaterial'
	}

	constructor (parameters, common = undefined) {
		super(parameters)
		this._iResolution = new THREE.Vector3(0, 0, 0)
		this._iChannelTime = new Array(4).fill(0)
		this._iChannelResolution = new Array(4).fill(new THREE.Vector3(0, 0, 0))
		this._iMouse = new THREE.Vector4(0, 0, 0, 0)
		this._iDate = new THREE.Vector4(0, 0, 0, 0)
		this._canUpdateUniform = true
		if (parameters !== undefined) {
			const baseUniformArray = [
				'uniform vec3 iResolution;',
				'uniform float iTime;',
				'uniform float iTimeDelta;',
				'uniform float iFrameRate;',
				'uniform int iFrame;',
				'uniform vec4 iMouse;',
				'uniform vec4 iDate;',
				'uniform float iChannelTime[4];',
				'uniform sampler2D iChannel0;',
				'uniform sampler2D iChannel1;',
				'uniform sampler2D iChannel2;',
				'uniform sampler2D iChannel3;',
				'uniform vec3 iChannelResolution[4];',
				'varying vec2 vUv;'
			]
			const vertexshader = parameters.vertexShader || vertex
			const vertexAppend = baseUniformArray.filter(v => !vertexshader.includes(v))
			this.vertexShader = `
    	  ${vertexAppend.length > 0 ? `${vertexAppend.join('\n')}` : ''}
    	  ${common || ''}
    	  ${vertexshader}
    	`
			const fragmentAppend = baseUniformArray.filter(v => !parameters.fragmentShader.includes(v))
			this.fragmentShader = `
    	  ${fragmentAppend.length > 0 ? `${fragmentAppend.join('\n')}` : ''}
    	  ${common || ''}
    	  ${parameters.fragmentShader}
    	`
		}
		// 着色器输入
		// uniform vec3      iResolution;           // viewport resolution (in pixels)
		// uniform float     iTime;                 // shader playback time (in seconds)
		// uniform float     iTimeDelta;            // render time (in seconds)
		// uniform float     iFrameRate;            // shader frame rate
		// uniform int       iFrame;                // shader playback frame
		// uniform float     iChannelTime[4];       // channel playback time (in seconds)
		// uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
		// uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
		// uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
		// uniform vec4      iDate;                 // (year, month, day, time in seconds)
		// uniform float     iSampleRate;           // sound sample rate (i.e., 44100)
		this._iChannels = [
			{ value: null },
			{ value: null },
			{ value: null },
			{ value: null }
		]
		this.uniforms = {
			// 屏幕分辨率（宽度和高度）的像素值，与视口尺寸相关
			iResolution: { value: this._iResolution },
			// 当前时间（以秒为单位），从着色器加载后开始计时，比较常用
			iTime: { value: 0 },
			// 自上一帧到当前帧的时间间隔（以秒为单位）
			iTimeDelta: { value: 0 },
			// 当前渲染的帧率
			iFrameRate: { value: 0 },
			// 当前帧的帧数
			iFrame: { value: 0 },
			// 用于获取鼠标的位置和状态信息。它是一个包含四个分量的vec4类型变量，分别表示鼠标的坐标（x 和 y 分量）以及左右键的按下状态（z 和 w 分量）。
			// 以画布的左下角为圆点
			// iMouse.x：鼠标当前位置的x坐标（以像素为单位）。
			// iMouse.y：鼠标当前位置的y坐标（以像素为单位）。
			// iMouse.z：鼠标按下的按钮（无按键：0.0，左键：1.0，右键：2.0，中键：3.0）。
			// iMouse.w：鼠标的点击状态（按下：1.0，释放：0.0）。
			iMouse: { value: this._iMouse },
			// 表示当前的年（x）、月（y）、日（z）、时间（时分秒转化为以秒计数）
			iDate: { value: this._iDate },
			// iChannelTime、iChannelResolution现只支持在ShadertoyPass中使用，并且iChannelXX只有赋值ShadertoyPass中的Buffer才行
			// 各个纹理通道的时间（以秒为单位）。通道0对应sampler2D iChannel0，通道1对应sampler2D iChannel1，以此类推。
			iChannelTime: { value: this._iChannelTime },
			// 各个纹理通道的分辨率（宽度、高度和深度）。通道0对应sampler2D iChannel0，通道1对应sampler2D iChannel1，以此类推。
			iChannelResolution: { value: this._iChannelResolution },
			iChannel0: this._iChannels[0],
			iChannel1: this._iChannels[1],
			iChannel2: this._iChannels[2],
			iChannel3: this._iChannels[3],
			...(parameters?.uniforms || {})
		}

		this._renderer = null
		this._mousemoveHandler = null
		this._mousedownHandler = null
		this._mouseupHandler = null

		this._currentTime = Date.now()
		this._renderFrame = 0
	}

	onBeforeRender (renderer, scene, camera, geometry, object, group) {
		super.onBeforeRender(renderer, scene, camera, geometry, object, group)
		// 设置当前渲染区域大小
		renderer.getSize(this._iResolution)
		if (this._canUpdateUniform) {
			const now = Date.now()
			const deltaTime = now - this._currentTime
			// 设置当前帧与上一帧的渲染时间差
			this.uniforms.iTimeDelta.value = deltaTime / 1000
			// 设置已渲染时长
			this.uniforms.iTime.value = this.uniforms.iTime.value + this.uniforms.iTimeDelta.value
			// 设置当前渲染帧率
			this.uniforms.iFrameRate.value = Math.floor(1000 / deltaTime)
			this._currentTime = now
			// 设置当前渲染帧数
			this._renderFrame = this._renderFrame + 1
			this.uniforms.iFrame.value = this._renderFrame
			// 设置当前时间
			this._iDate.set(dayjs().year(), dayjs().month() + 1, dayjs().day(), dayjs().hour() * 3600 + dayjs().minute() * 60 + dayjs().second())
		}
	}

	onBeforeCompile (shaderobject, renderer) {
		// onBeforeCompile居然在onBeforeRender执行了一次后才执行
		super.onBeforeCompile(shaderobject, renderer)
		this._renderer = renderer
		this.setCanUpdateShadertoyUniform(this._canUpdateUniform)
		this._mousemoveHandler = this._renderer.domElement.addEventListener('mousemove', (e) => {
			this.onMouseMove(e)
		})
		this._mousedownHandler = this._renderer.domElement.addEventListener('mousedown', (e) => {
			this.onMouseDown(e)
		})
		this._mouseupHandler = this._renderer.domElement.addEventListener('mouseup', (e) => {
			this.onMouseUp(e)
		})
	}

	setCanUpdateShadertoyUniform (val) {
		this._canUpdateUniform = val
		if (this._canUpdateUniform) {
			this._currentTime = Date.now()
		}
	}

	dispose () {
		super.dispose()
		this._mousemoveHandler && this._renderer.domElement.removeEventListener('mousemove', this._mousemoveHandler)
		this._mousedownHandler && this._renderer.domElement.removeEventListener('mousedown', this._mousedownHandler)
		this._mouseupHandler && this._renderer.domElement.removeEventListener('mouseup', this._mouseupHandler)
	}

	getChannel (channelIndex) {
		return this._iChannels[channelIndex]
	}

	setChannel (channelIndex, value) {
		return this._iChannels[channelIndex].value = value
	}

	getUniforms (prop) {
		return _.cloneDeep(this.uniforms[prop].value)
	}

	setUniforms (prop, value) {
		if (this.uniforms[prop].value && (this.uniforms[prop].value.isVector4 || this.uniforms[prop].value.isVector3 || this.uniforms[prop].value.isVector2)) {
			this.uniforms[prop].value.copy(value)
		} else {
			this.uniforms[prop].value = value
		}
	}

	onMouseMove (e) {
		const X = e.offsetX
		const Y = this._iResolution.y - e.offsetY
		this._iMouse.setX(X)
		this._iMouse.setY(Y)
	}

	onMouseDown (e) {
		switch (e.button) {
			case 0:
				// 按下鼠标左键
				this._iMouse.setZ(1)
				this._iMouse.setW(1)
				break
			case 1:
				// 按下鼠标中键
				this._iMouse.setZ(3)
				this._iMouse.setW(1)
				break
			case 2:
				// 按下鼠标右键
				this._iMouse.setZ(2)
				this._iMouse.setW(1)
				break
		}
	}

	onMouseUp (e) {
		this._iMouse.setZ(0)
		this._iMouse.setW(0)
	}
}
