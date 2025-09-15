<script setup lang="ts">
defineProps<{
  text?: string,
  icon?: string,
  disabled?: boolean
}>();
</script>
<template>
  <div class="w-full fixed left-0 bottom-0 p-5">
    <button type="submit" :disabled="disabled"
            class="w-full py-4 disabled:bg-blue-200 disabled:cursor-not-allowed	 bg-blue-600 rounded-lg font-bold text-white flex ">
      <div class="m-auto flex gap-4 items-center">
        <span v-if="icon"><v-icon>{{ icon }}</v-icon></span>
        <span v-if="!text">Enviar</span>
        <span v-if="text">{{ text }}</span>
      </div>
    </button>
  </div>

</template>