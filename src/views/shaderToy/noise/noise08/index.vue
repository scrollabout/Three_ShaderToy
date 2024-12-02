<template>
  <div class="full-view" style="overflow-y: auto; display: flex; flex-direction: column;">
    <div
      ref="renderView"
      class="full-view"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Beam from './Beam.js'
import { useRenderMixin } from '@/views/mixins/renderMixins'

const renderMixin = useRenderMixin('renderView')

const scene = new THREE.Scene()
const beam = new Beam()
const clock = new THREE.Clock();

renderMixin.render = () => {
  const time = clock.getDelta()
  beam.render(time)
  renderMixin.renderer.render(scene, renderMixin.camera)
}

function init () {
  beam.createObj()
  scene.add(beam.obj)

  renderMixin.renderer.setClearColor(0x0e0e0e, 1.0)
  renderMixin.camera.position.set(0, 0, 100)
  renderMixin.camera.lookAt(new THREE.Vector3(0, 0, 0))
}

onMounted(() => {
  init()
})

</script>

<style lang="scss" scoped>
.step-canvas {
  right: 0;
  top: 0;
  width: 300px;
  height: 180px;
  margin-bottom: 20px;
  background: white;
}
</style>
