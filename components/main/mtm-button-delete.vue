<script setup lang="ts">
defineProps<{
  text?: string,
  icon?: string,
  disabled?: boolean
}>();
</script>

<template>
  <button type="button" class="text-red-600 flex items-center gap-2 hover:bg-red-50 px-4 py-2 w-fit rounded-xl border-solid border-red-600 border-2">
    <v-icon>mdi-delete</v-icon>
    <span >{{ text }}</span>
  </button>
</template>
