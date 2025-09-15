<script setup lang="ts">
// Define las propiedades con valores opcionales
const props = defineProps<{
  modelValue?: any;
  label?: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  prepend_inner_icon?: string;
  append_inner_icon?: string;
  clearable?: boolean;
  readonly?: boolean;
  rules?: Array<(value: string) => true | string>; // Acepta reglas de validación
}>();

const emit = defineEmits(['update:modelValue']);

// `ref` simple para manejar la reactividad del valor
const vmodel = ref<string | number | undefined>(props.modelValue);

// Sincroniza el valor inicial desde `modelValue` a `vmodel`
watch(
    () => props.modelValue,
    (value) => {
      // Convierte automáticamente a número si el tipo es `number`
      vmodel.value = props.type === 'number' && value !== undefined ? Number(value) : value;
    },
    { immediate: true }
);

// Emite cambios del `vmodel` hacia `modelValue`
watch(
    vmodel,
    (value) => {
      const sanitizedValue = props.type === 'number' && value !== undefined ? Number(value) : value;
      emit('update:modelValue', sanitizedValue);
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
        :type="type"
        :rules="[() => !required || !!vmodel || 'Campo requerido', props.rules]"
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