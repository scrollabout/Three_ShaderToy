<template>
  <div
    id="renderView"
    ref="renderView"
    class="full-view"
  />
</template>

<script>
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ShaderToyMaterial } from '@/views/material/ShaderToyMaterial.js'
import vertexShader from '@/views/shaders/shaderToy/waveForDisplacement/vertex.glsl'
import fragmentShader from '@/views/shaders/shaderToy/waveForDisplacement/fragment.glsl'

let composer = null

export default {
  data () {
    return {
      containerSize: {
        width: '',
        height: ''
      },
      container: '',
      renderer: '',
      controls: '',
      scene: '',
      camera: ''
    }
  },
  created () {
    window.addEventListener('resize', this.onWindowResize)
  },
  mounted () {
    this.$nextTick(() => {
      this.updateContainerSize()
      this.init()
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize)
    this.renderer.setAnimationLoop(null)
  },
  methods: {
    init () {
      this.container = document.getElementById('renderView')
      this.createRender()
      this.container.appendChild(this.renderer.domElement)
      this.createScene()
      this.createCamera()
      this.createCameraControl()
      composer = new EffectComposer(this.renderer)
      composer.addPass(new ShaderPass(new ShaderToyMaterial({
        uniforms: {},
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      })))
    },
    // 创建渲染器
    createRender () {
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.containerSize.width, this.containerSize.height)
      this.renderer.setAnimationLoop(this.render)
      // this.renderer.toneMapping = THREE.NoToneMapping
      // this.renderer.toneMappingExposure = 0.5
    },
    // 创建场景
    createScene () {
      this.scene = new THREE.Scene()
      const axesHelper = new THREE.AxesHelper(2000)
      axesHelper.layers.enableAll()
      this.scene.add(axesHelper)
    },
    // 创建摄像机
    createCamera () {
      this.camera = new THREE.PerspectiveCamera(55, this.containerSize.width / this.containerSize.height, 1, 20000)
      this.camera.position.set(0, 0, 60)
    },
    // 创建摄像机控制器
    createCameraControl () {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      // this.controls.maxPolarAngle = Math.PI * 0.495
      this.controls.target.set(0, 0, 0)
      // this.controls.minDistance = 40.0
      // this.controls.maxDistance = 200.0
      this.controls.update()
    },
    // 更新渲染框的大小
    updateContainerSize () {
      const width = this.$refs.renderView ? this.$refs.renderView.offsetWidth : 1
      const height = this.$refs.renderView ? this.$refs.renderView.offsetHeight : 1
      this.containerSize.width = width
      this.containerSize.height = height
      return {
        width,
        height
      }
    },
    // 窗口变化
    onWindowResize () {
      const size = this.updateContainerSize()
      this.camera.aspect = size.width / size.height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(size.width, size.height)
      composer.setSize(size.width, size.height)
    },
    // 渲染
    render () {
      composer.render()
    }
  }
}
</script>

<style
  scoped
  lang="scss"
>

</style>
