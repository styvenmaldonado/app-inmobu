<script setup lang="ts">
import {ref, defineProps, defineEmits, computed, watch, onMounted} from "vue";

type Item = {
  text?: string;
  [key: string]: any;
};

type Props = {
  items: Item[];
  modelValue?: any;
  label?: string;
  placeholder?: string;
  items_title?: string;          // Clave para mostrar el título (por defecto 'text')
  items_value?: string;          // Clave para mostrar el valor
  required?: boolean;            // Requerido (validación)
  multiple?: boolean;            // Selección múltiple
  prepend_inner_icon?: string;   // Ícono al inicio del campo
  append_inner_icon?: string;    // Ícono al final del campo
  return_object?: boolean;       // Retornar un objeto en lugar del valor
  clearable?: boolean;           // Si se puede limpiar el campo
  readonly?: boolean;            // Sólo lectura
  value?: string;                // Valor del campo
  density?:string
};

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);
const isLoaded = ref(false);

onMounted(() => {
  isLoaded.value = true;
})

// Model Value reactivo
const modelValue = ref(undefined);

watch(
    () => props.modelValue,
    (newValue) => {
      modelValue.value = newValue;
    },
    {immediate: true}
);

// Computado para gestionar cambiadores dinámicos del valor
const computedModelValue = computed({
  get() {
    if (!modelValue.value) return null;
    return props.items.find(
        (p) => p?.[props.items_title || "text"] === modelValue.value
    ) || modelValue.value;
  },
  set(value: any) {
    modelValue.value = value;
    emit(
        "update:modelValue",
        props.return_object
            ? props.items.find((p) => p?.[props.items_value || "text"] === value) ||
            value
            : value
    );
  },
});

// Regla de validación si es requerido
const requiredRule = (value: any) =>
    !props.required || !!value || "Campo requerido";


const dynamicTitle = computed(() => (item: any) => {
  return item?.raw?.[props.items_title || "text"]
});
</script>

<template>
  <div class="flex flex-col gap-2 w-full mt-auto" v-if="isLoaded">
    <label v-if="label" class="font-bold">
      {{ props.label }}
      <span v-if="props.required" class="text-red-600">*</span>
    </label>
    <v-autocomplete
        v-model="computedModelValue"
        :rules="[requiredRule]"
        :items="props.items"
        :item-value="props.items_value"
        :item-title="props.items_title"
        :prepend-inner-icon="props.prepend_inner_icon"
        :append-inner-icon="props.append_inner_icon"
        :multiple="props.multiple"
        variant="outlined"
        :clearable="props.clearable"
        :readonly="readonly"
        :placeholder="placeholder"
        :density="density"
    >
      <template v-slot:chip="{ props, item }">
        <span v-bind="props">
          {{ dynamicTitle(item) }}
        </span>
      </template>

      <template v-slot:item="{ props, item }">
        <v-list-item
            v-bind="props"
            :title="dynamicTitle(item)"
        ></v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>