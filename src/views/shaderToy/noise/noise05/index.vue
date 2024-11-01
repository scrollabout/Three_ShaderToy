<template>
  <div
    id="renderView"
    ref="renderView"
    class="full-view"
  />
</template>

<script setup>
import { useShadertoyRenderMixins } from '@/views/mixins/shadertoyRenderMixins'
import fragment from '@/views/shaders/noise04/fragment.glsl'
import common from '@/views/shaders/noise04/common.glsl'

useShadertoyRenderMixins(
  'renderView',
  { fragmentShader: fragment },
  common
)
</script>
