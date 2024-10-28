<template>
  <div
    id="renderView"
    ref="renderView"
    class="full-view"
  />
</template>

<script setup>
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { ShaderToyMaterial } from '@/views/material/ShaderToyMaterial.js'
import vertexShader from '@/views/shaders/noise02/vertex.glsl'
import fragmentShader from '@/views/shaders/noise02/fragment.glsl'
import { useTemplateRef, onBeforeUnmount, onMounted, nextTick } from 'vue'

let composer = null
let containerSize = {
  width: 1,
  height: 1
}
let container = null
let renderer = null

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
  composer = new EffectComposer(renderer)
  composer.addPass(new ShaderPass(new ShaderToyMaterial({
    uniforms: {},
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  })))
}

// 创建渲染器
function createRender () {
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(containerSize.width, containerSize.height)
  renderer.setAnimationLoop(render)
  // renderer.toneMapping = THREE.NoToneMapping
  // renderer.toneMappingExposure = 0.5
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
  renderer.setSize(size.width, size.height)
  composer.setSize(size.width, size.height)
}

// 渲染
function render () {
  composer.render()
}
</script>

<style
  scoped
  lang="scss"
>

</style>
