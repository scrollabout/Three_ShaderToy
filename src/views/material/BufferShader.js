class BufferShader {
	scene = new THREE.Scene()
	readBuffer = THREE.WebGLRenderTarget
	writeBuffer = THREE.WebGLRenderTarget

	constructor (renderer, camera, fragment, uniforms, width, height) {
		this.readBuffer = new THREE.WebGLRenderTarget(width, height, {
			format: THREE.RGBAFormat,
			type: THREE.FloatType,
		})
		this.writeBuffer = this.readBuffer.clone()

		this.createMesh()
	}

	swapBuffers () {
		const tmp = this.readBuffer
		this.readBuffer = this.writeBuffer
		this.writeBuffer = tmp
	}

	render () {
		this.renderer.setRenderTarget(this.writeBuffer)
		this.renderer.render(this.scene, this.camera)
		this.renderer.setRenderTarget(null)
		this.swapBuffers()
	}

	createMesh () {
		this.scene.add(
			new THREE.Mesh(
				new THREE.PlaneGeometry(2, 2),
				new THREE.ShaderMaterial({
					fragmentShader: this.fragment,
					vertexShader: `void main() {
                
                        gl_Position = vec4(position, 1.0);
                     
                }`,
					uniforms: this.uniforms,
				})
			)
		)
	}
}
