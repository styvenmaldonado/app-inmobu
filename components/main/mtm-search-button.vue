<script setup lang="ts">
defineProps<{
  text?: string,
  icon?: string,
  disabled?: boolean
}>()
</script>
<template>
  <button type="submit" :disabled="disabled"
          class="mt-2 w-fit h-14 py-2 px-6 disabled:bg-blue-200 disabled:cursor-not-allowed	 bg-blue-600 rounded-lg font-bold text-white flex">
    <div class="m-auto flex gap-4 items-center">
      <span v-if="icon"><v-icon>{{ icon }}</v-icon></span>
      <span v-if="!text">Enviar</span>
      <span v-if="text">{{ text }}</span>
    </div>
  </button>
</template>