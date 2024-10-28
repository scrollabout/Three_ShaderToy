import * as THREE from 'three'
import vertexShader from '../shaders/water/vertex.glsl'
import fragmentShader from '../shaders/water/fragment.glsl'
export class WaterShader {
  constructor (planeBufferGeometry, light, skybox) {
    this.geometry = planeBufferGeometry
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        light: { value: light },
        water: { value: null },
        tDiffuse: { value: null },
        skybox: { value: skybox }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })
    this.material.extensions = {
      derivatives: true
    }
    this.mesh = new THREE.Mesh(this.geometry, this.material)
  }

  setUniformsValue (prop, value) {
    if (this.material.uniforms[prop]) {
      this.material.uniforms[prop].value = value
    }
  }
}
