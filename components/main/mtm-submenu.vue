<script setup lang="ts">
defineProps<{
  items?: {
    title: string;
    href: string;
    icon: string;
    active?: boolean;
  }[];
}>();
</script>
<template>
  <div
    class="flex gap-2 py-2 mb-4 rounded-lg border-gray-200 border-b w-full"
  >
    <NuxtLink
      v-for="(item, index) in items"
      :key="index"
      :class="
        item.active
          ? 'flex gap-2 items-center bg-blue-600 text-white py-3 px-2 rounded-lg w-fit'
          : 'flex gap-2 items-center  py-3 px-2 rounded-lg w-fit'
      "
      :to="item.href"
    >
      <v-icon>{{ item.icon }}</v-icon>
      <span>{{ item.title }}</span>
    </NuxtLink>
  </div>
</template>
