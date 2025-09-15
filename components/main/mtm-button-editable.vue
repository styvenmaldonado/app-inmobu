<script setup lang="ts">
defineProps<{
  text?: string,
  icon?: string,
  disabled?: boolean
}>();
</script>

<template>
  <button type="button"  class="text-blue-600 flex items-center gap-2 hover:bg-blue-50 px-4 py-2 w-fit rounded-xl border-solid border-blue-600 border-2">
    <v-icon>mdi-pencil</v-icon>
    <span>{{text}}</span>
  </button>
</template>
