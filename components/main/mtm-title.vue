
<script setup lang="ts">
defineProps<{
    title: string,
    description?: string,
    icon?: string
}>()
</script>
<template>
    <div class="flex items-center gap-4 w-full">
        <div v-if="icon"><v-icon size="x-large">{{ icon}}</v-icon></div>
        <div class="flex flex-col">
            <h1 class="font-bold text-2xl">{{ title }}</h1>
         <p v-if="description" class="font-light">{{ description }}</p>
        </div>  
    </div>
</template>