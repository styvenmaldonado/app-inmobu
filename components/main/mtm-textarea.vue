<script setup lang="ts">
const modelValue = defineModel();
const props = defineProps<{
  label?: string
  placeholder?: string
  required?: boolean
}>()

</script>
<template>
  <div class="flex flex-col gap-2 w-full">
    <label class="font-bold">{{ props.label }} <span v-if="required" class="text-red-600">*</span></label>
    <v-textarea 
    :rules="[() => !required || !!modelValue || 'Campo requerido']"
    v-model="modelValue" :placeholder="placeholder" variant="outlined" />
  </div>
</template>