<script setup lang="ts">
interface Items {
  label?: string;
  href?: string;
  icon?: string;
  value: string | undefined;

}
const props = defineProps<{
  class?: string;
  items?: Items[];
}>();
</script>
<template>
  <div :class="props.class">
    <div v-for="(item, index) in items?.filter(i => i.value !== undefined )" :key="index" class="flex flex-col">
      <div v-if="item.icon || item.label" class="flex items-center gap-2">
        <v-icon v-if="item.icon">{{item.icon}}</v-icon>
        <span v-if="item.label" class="font-bold">{{ item.label }}</span>
      </div>
      <NuxtLink v-if="item.href" :to="item?.href" class="text-blue-600 underline" >{{item.value}}</NuxtLink>
      <span v-if="!item.href" >{{item.value}}</span>
    </div>
  </div>
</template>
