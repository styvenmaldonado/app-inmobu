<script setup lang="ts">
const props = defineProps<{
  step?: number
}>()
</script>
<template>
  <slot :name="'item.'+props.step"></slot>
</template>

