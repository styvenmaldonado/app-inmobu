<script setup lang="ts">
import 'flag-icons/css/flag-icons.min.css';
import 'v-phone-input/dist/v-phone-input.css';
import { VPhoneInput } from "v-phone-input";
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
    <v-phone-input
        :prefer-countries="['CO', 'MX', 'AR', 'PE', 'EC', 'US', 'VE']"
        :required="required"
        variant="outlined"
        country-label="Indicativo"
        label="Teléfono"
        country-icon-mode="svg"
    />
  </div>
</template>