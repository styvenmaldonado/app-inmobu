<script setup lang="ts">
defineProps<{
  size?: "small" | "medium" | "large";
}>();
</script>
<template>
  <div v-if="size == 'small'" class="my-2"></div>
  <div v-if="size == 'medium' || !size" class="my-4"></div>
  <div v-if="size == 'large'" class="my-6"></div>
</template>
