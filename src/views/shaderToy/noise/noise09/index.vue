<template>
  <div
    id="renderView"
    ref="renderView"
    class="full-view"
  />
</template>

<script setup>
import { useShadertoyRenderMixins } from '@/views/mixins/shadertoyRenderMixins'
import fragment from '@/views/shaders/noise09/fragment.frag'

useShadertoyRenderMixins(
  'renderView',
  { fragmentShader: fragment }
)
</script>
