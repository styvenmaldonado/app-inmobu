<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>
<template>
    <button type="submit" class="text-gray-800 bg-gray-100 flex items-center gap-4  p-4 w-full rounded-xl py-24 border-gray-800 border border-dashed my-6">
       <div class="flex gap-4 items-center m-auto"> <v-icon>mdi-plus-circle-outline</v-icon>
        <span>{{ text }}</span></div>
    </button>
</template>