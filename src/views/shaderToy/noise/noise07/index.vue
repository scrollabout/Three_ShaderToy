<template>
  <div class="full-view" style="overflow-y: auto; display: flex; flex-direction: column;">
    <div
      ref="renderView"
      class="full-view"
    />
    <div
      class="flex-column"
      style="position: absolute; right: 20px; top: 20px;"
    >
      <div
        ref="BufferAStep"
        class="step-canvas"
      />
      <!--      <div
              ref="BufferBStep"
              class="step-canvas"
            />
            <div
              ref="BufferCStep"
              class="step-canvas"
            />-->
    </div>
  </div>
</template>

<script setup>
import { useShadertoyRenderMixins } from '@/views/mixins/shadertoyRenderMixins'
import Image from '@/views/shaders/noise06/Image.frag'
import BufferA from '@/views/shaders/noise06/BufferA.frag'
import BufferB from '@/views/shaders/noise06/BufferB.frag'
import BufferC from '@/views/shaders/noise06/BufferC.frag'
import { onMounted, useTemplateRef } from 'vue'
import { ShadertoyBufferPass } from '@/views/pass/ShadertoyBufferPass'
import { OutputPass } from 'three/addons'

const BufferAStep = useTemplateRef('BufferAStep')
/*
** const BufferBStep = useTemplateRef('BufferBStep')
** const BufferCStep = useTemplateRef('BufferCStep')
*/
const renderer = new THREE.WebGLRenderer()
renderer.setSize(300, 180)
renderer.setPixelRatio(window.devicePixelRatio)
const outputPass = new OutputPass()
outputPass.renderToScreen = true

onMounted(() => {
  BufferAStep.value.appendChild(renderer.domElement)
})

const shadertoy = useShadertoyRenderMixins(
  'renderView',
  { fragmentShader: Image },
  undefined,
  { fragmentShader: BufferA },
  { fragmentShader: BufferB },
  { fragmentShader: BufferC },
)

shadertoy.renderMixins.render = () => {
  shadertoy.shadertoyPass.setIChannelBuffer(0, 0, 2)
  shadertoy.shadertoyPass.setIChannelBuffer(0, 1, 3)
  shadertoy.shadertoyPass.setIChannelBuffer(3, 0, 2)
  shadertoy.shadertoyPass.setIChannelBuffer(3, 1, 3)
  shadertoy.shadertoyPass.setIChannelBuffer(2, 0, 1)
  shadertoy.composer.render()
  // outputPass.render(shadertoy.renderMixins.renderer, null, shadertoy.shadertoyPass.getBufferRenderTarget(1))
}


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
