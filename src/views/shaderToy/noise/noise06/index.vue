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
      <canvas
        ref="BufferAStep"
        class="step-canvas"
      />
      <canvas
        ref="BufferBStep"
        class="step-canvas"
      />
      <canvas
        ref="BufferCStep"
        class="step-canvas"
      />
    </div>
  </div>
</template>

<script setup>
import { useShadertoyRenderMixins } from '@/views/mixins/shadertoyRenderMixins'
import Image from '@/views/shaders/noise06/Image.frag'
import BufferA from '@/views/shaders/noise06/BufferA.frag'
import BufferB from '@/views/shaders/noise06/BufferB.frag'
import BufferC from '@/views/shaders/noise06/BufferC.frag'
import { useTemplateRef } from 'vue'

const BufferAStep = useTemplateRef('BufferAStep')
const BufferBStep = useTemplateRef('BufferBStep')
const BufferCStep = useTemplateRef('BufferCStep')

const shadertoy = useShadertoyRenderMixins(
  'renderView',
  { fragmentShader: Image },
  undefined,
  { fragmentShader: BufferA },
  { fragmentShader: BufferB },
  { fragmentShader: BufferC },
)

function previewBufferRender (domElement, RT) {
  if (!domElement || !domElement.value) {
    return
  }
  const ctx = domElement.value.getContext('2d')
  const { width, height } = RT
  const buffer = new Uint8Array(width * height * 4)
  shadertoy.renderMixins.renderer.readRenderTargetPixels(RT, 0, 0, width, height, buffer) // 读取像素到 buffer
  const clamped = new Uint8ClampedArray(buffer.buffer)
  const imageData = new ImageData(clamped, width, height) // 创建可供 canvas 使用的图像数据类型
  // 绘制到 canvas 中
  // TODO: 图片压缩
  ctx.putImageData(imageData, 0, 0)
}

shadertoy.renderMixins.render = () => {
  shadertoy.shadertoyPass.setIChannelBuffer(0, 0, 2)
  shadertoy.shadertoyPass.setIChannelBuffer(0, 1, 3)
  shadertoy.shadertoyPass.setIChannelBuffer(3, 0, 2)
  shadertoy.shadertoyPass.setIChannelBuffer(3, 1, 3)
  shadertoy.shadertoyPass.setIChannelBuffer(2, 0, 1)
  shadertoy.composer.render()
  previewBufferRender(BufferAStep, shadertoy.shadertoyPass.getBufferRenderTarget(1))
  previewBufferRender(BufferBStep, shadertoy.shadertoyPass.getBufferRenderTarget(2))
  previewBufferRender(BufferCStep, shadertoy.shadertoyPass.getBufferRenderTarget(3))
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
