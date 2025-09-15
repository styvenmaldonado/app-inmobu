<script setup lang="ts">
const props = defineProps<{
  text: string
}>()
</script>
<template>
    <button type="button" class="text-blue-600 flex items-center gap-4 hover:bg-blue-50 p-4 w-fit rounded-xl">
        <v-icon>mdi-plus-circle-outline</v-icon>
        <span>{{ text }}</span>
    </button>
</template>