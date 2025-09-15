<script setup lang="ts">
defineProps<{
    text?: string,
    icon?: string
}>()
</script>
<template>
    <button type="submit" class="w-full py-4 border-blue-600 border rounded-lg font-bold text-blue-600 flex">
        <div class="m-auto flex gap-4 items-center">
            <span v-if="icon"><v-icon>{{ icon }}</v-icon></span>
            <span v-if="text">{{ text }}</span>
        </div>
    </button>
</template>