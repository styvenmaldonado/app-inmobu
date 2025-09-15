<script setup lang="ts">
defineProps<{
    items?: {
        title: string,
        href: string,
        icon: string,
        active?: boolean
    }[]

}>()
</script>
<template>
    <div class="flex gap-2 border-b-2 border-gray-300 font-light">
        <div v-for="(i, index) in items">
            <a :key="index" :href="i.href" :class="i.active ?'px-4 py-3 font-bold bg-blue-200 rounded-t-lg flex gap-2 border-b-4 border-blue-700 text-blue-700':'px-4 py-3 flex gap-2 hover:bg-gray-200 rounded-t-lg'">
                <v-icon>{{ i.icon }}</v-icon>
                <span>{{ i.title }}</span>
            </a>
        </div>
    </div>
</template>