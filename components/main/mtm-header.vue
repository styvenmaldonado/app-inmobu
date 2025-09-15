<script setup lang="ts">
defineProps<{
    title: string,
    description: string,
    button?: {
        route: string,
        title: string,
        icon: string
    }
}>()

const UIStore = useGlobalUIStore()
</script>
<template>
    <div class="flex items-center w-full">
        <div>
            <h1 class="text-2xl font-bold">{{ title }}</h1>
            <span>{{ description }}</span>
        </div>
        <div v-if="button" class="ml-auto">
            <NuxtLink
                @click="UIStore.showLoading()"
                class="bg-blue-600  w-auto py-3 px-4 rounded-lg shadow-lg text-white flex items-center gap-2 text-nowrap"
                :to="button.route">
                <v-icon>{{button.icon}}</v-icon>
                <span>{{ button.title }}</span>
            </NuxtLink>
        </div>
    </div>
</template>