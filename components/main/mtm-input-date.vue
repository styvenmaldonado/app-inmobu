<script setup lang="ts">
import { formatDate } from "~/utils/format";

const props = defineProps<{
  modelValue: string | Date | undefined; // El modelValue admite cadenas o Date
  label?: string;
  placeholder?: string;
  required?: boolean;
  prepend_inner_icon?: string;
  append_inner_icon?: string;
  clearable?: boolean;
  readonly?: boolean;
  rules?: Array<(value: string) => true | string>; // Reglas de validación
}>();

const emit = defineEmits(['update:modelValue']);

// Usamos ref para manejar el valor reactivo
const vmodel = ref<string>(formatDate(props.modelValue, "yyyy-MM-dd"));

// Sincroniza el valor inicial desde modelValue al vmodel
watch(
    () => props.modelValue,
    (value) => {
      vmodel.value = value ? formatDate(new Date(value), "yyyy-MM-dd") : '';
    },
    { immediate: true }
);

// Emite cambios del vmodel al modelValue en formato Date ISO
watch(
    vmodel,
    (value) => {
      if (value) {
        const date = new Date(`${value}T00:00:00`); // Crear un objeto Date válido
        emit('update:modelValue', date.toISOString()); // Se emite como ISO-8601 completo
      } else {
        emit('update:modelValue', undefined); // Maneja valores vacíos
      }
    }
);
</script>

<template>
  <div class="flex flex-col gap-2 w-full mt-auto">
    <label v-if="label" class="font-bold">
      {{ props.label }}
      <span v-if="required" class="text-red-600">*</span>
    </label>
    <v-text-field
        type="date"
        :rules="[() => !required || !!modelValue || 'Campo requerido', ...(props.rules || [])]"
        :placeholder="placeholder"
        :prepend-inner-icon="prepend_inner_icon"
        :append-inner-icon="append_inner_icon"
        v-model.trim="vmodel"
    :clearable="clearable"
    :readonly="readonly"
    variant="outlined"
    >
    </v-text-field>
  </div>
</template>