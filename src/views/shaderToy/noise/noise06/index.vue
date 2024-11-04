<template>
  <div class="full-view" style="overflow-y: auto; display: flex; flex-direction: column;">
    <div
      ref="renderView"
      class="full-view"
      style="height: 50%;"
    />
    <div
      class="full-view flex-auto-height"
      style="height: 50%;"
    >
      <canvas
        ref="BufferAStep"
        class="full-view"
      />
      <!--      <canvas
              ref="BufferBStep"
              style="right: 0; top: 0; width: 300px; height: 180px; margin-bottom: 20px; background: white;"
            />
            <canvas
              ref="BufferCStep"
              style="right: 0; top: 0; width: 300px; height: 180px; margin-bottom: 20px; background: white;"
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
import { onMounted, useTemplateRef, toRaw } from 'vue'

// image:0:B,1:C
// C:0:B,1:C
// B:0:A
const BufferAStep = useTemplateRef('BufferAStep')
/*
const BufferBStep = useTemplateRef('BufferBStep')
const BufferCStep = useTemplateRef('BufferCStep')
*/

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
  ctx.putImageData(imageData, 0, 0) // 绘制到 canvas 中
  // const imageObject = new Image()
  // imageObject.onload = function () {
  //   ctx.clearRect(0, 0, width, height)
  //   ctx.scale(0.25, 0.25)
  //   ctx.drawImage(imageObject, 0, 0)
  // }
  // imageObject.src = domElement.value.toDataURL()
  // ctx.scale(0.025, 0.025)
  // ctx.drawImage(domElement.value, 0, 0)
}

shadertoy.renderMixins.render = () => {
  shadertoy.shadertoyPass.setIChannelBuffer(0, 0, 2)
  shadertoy.shadertoyPass.setIChannelBuffer(0, 1, 3)
  shadertoy.shadertoyPass.setIChannelBuffer(3, 0, 2)
  shadertoy.shadertoyPass.setIChannelBuffer(3, 1, 3)
  shadertoy.shadertoyPass.setIChannelBuffer(2, 0, 1)
  toRaw(shadertoy.composer).render()
  previewBufferRender(BufferAStep, shadertoy.shadertoyPass.getBufferRenderTarget(1))
  // previewBufferRender(BufferAStep, shadertoy.shadertoyPass.value.getBufferRenderTarget(1))
  /*
  previewBufferRender(BufferBStep, shadertoy.shadertoyPass.value.getBufferRenderTarget(2))
  previewBufferRender(BufferCStep, shadertoy.shadertoyPass.value.getBufferRenderTarget(3))
  */
}

</script>
