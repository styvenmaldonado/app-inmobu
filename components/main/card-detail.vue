<script setup lang="ts">
const emit = defineEmits(["remove"]);

interface Items {
  label?: string;
  value: string[];
}

const props = defineProps<{
  items?: Items[];
}>();
</script>
<template>
  <div v-for="(item, index) in items" :key="index">
    <div v-if="item.value" class="flex flex-col">
      <span class="font-bold">{{ item.label }}</span>
      <div v-for="(v, index) in item.value" class="flex flex-col" :key="index">
        <span>{{ v }}</span>
      </div>
    </div>
  </div>
</template>
