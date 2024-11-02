<template>
  <div
    id="renderView"
    ref="renderView"
    class="full-view"
  />
</template>

<script setup>
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { useTemplateRef, onBeforeUnmount, onMounted, nextTick } from 'vue'
import { ShadertoyPass } from '@/views/pass/ShadertoyPass'
import LonglowCommon from '@/views/shaders/ShadertoyPassTest/LonglowCommon.frag'
import LonglowImage from '@/views/shaders/ShadertoyPassTest/LonglowImage.frag'
import LonglowBufferA from '@/views/shaders/ShadertoyPassTest/LonglowBufferA.frag'
import { RenderPass } from 'three/addons'

let composer = null
let containerSize = {
  width: 1,
  height: 1
}
let container = null
let renderer = null
let controls = null
let scene = null
let camera = null
let shadertoyPass = null

const $refs = useTemplateRef('renderView')

window.addEventListener('resize', onWindowResize)

onMounted(() => {
  nextTick(() => {
    updateContainerSize()
    init()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  renderer.setAnimationLoop(null)
})

function init () {
  container = document.getElementById('renderView')
  createRender()
  container.appendChild(renderer.domElement)
  createScene()
  createCamera()
  createCameraControl()
  composer = new EffectComposer(renderer)

  const geometry = new THREE.BoxGeometry(150, 150, 150, 2, 2, 2)
  const material = new THREE.MeshNormalMaterial()
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  const renderPass = new RenderPass(scene, camera)

  shadertoyPass = new ShadertoyPass(
    renderer,
    { fragmentShader: LonglowImage },
    LonglowCommon,
    { fragmentShader: LonglowBufferA }
  )

  composer.addPass(renderPass)
  composer.addPass(shadertoyPass)
}

// 创建渲染器
function createRender () {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  renderer.setClearAlpha(0)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(containerSize.width, containerSize.height)
  renderer.setAnimationLoop(render)
  // renderer.toneMapping = THREE.NoToneMapping
  // renderer.toneMappingExposure = 0.5
}

// 创建场景
function createScene () {
  scene = new THREE.Scene()
  scene.background = null
  const axesHelper = new THREE.AxesHelper(2000)
  axesHelper.layers.enableAll()
  scene.add(axesHelper)
}

// 创建摄像机
function createCamera () {
  camera = new THREE.PerspectiveCamera(60, containerSize.width / containerSize.height, 1, 20000)
  camera.position.z = 400
}

// 创建摄像机控制器
function createCameraControl () {
  controls = new OrbitControls(camera, renderer.domElement)
  // controls.maxPolarAngle = Math.PI * 0.495
  controls.target.set(0, 0, 0)
  // controls.minDistance = 40.0
  // controls.maxDistance = 200.0
  controls.update()
}

// 更新渲染框的大小
function updateContainerSize () {
  const width = $refs.value ? $refs.value.offsetWidth : 1
  const height = $refs.value ? $refs.value.offsetHeight : 1
  containerSize.width = width
  containerSize.height = height
  return {
    width,
    height
  }
}

// 窗口变化
function onWindowResize () {
  const size = updateContainerSize()
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()
  renderer.setSize(size.width, size.height)
  composer.setSize(size.width, size.height)
}

// 渲染
function render () {
  composer.render()
  shadertoyPass.setIChannelBuffer(0, 0, 1)
}
</script>
