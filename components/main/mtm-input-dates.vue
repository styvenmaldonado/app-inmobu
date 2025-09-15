<script setup lang="ts">
const emit = defineEmits(['update:modelValue'])

const props = defineProps<{
  label?: string
  placeholder?: string
  required?: boolean
  hideRequired?:boolean
  type?:string
  prepend_inner_icon?:string
  append_inner_icon?: string
}>()

const showDatePicker = ref()
const dates = ref()
const model = reactive({
  datetime_start: '',
  datetime_end : ''
})



// Computed property para formatear el rango de fechas como texto
const dateRangeText = computed(() => {
  if (dates.value) {
    return `${formatDate(dates.value[0])} - ${formatDate(dates.value[dates.value.length - 1])}`;
  } else {
    return '';
  }
});

// Función para manejar el cambio de fecha
const updateDateRange = (newDates: [Date, Date]) => {
  dates.value = newDates;

  // Actualizar los campos del modelo con las fechas seleccionadas
  model.datetime_start = formatDate(newDates[0]);
  model.datetime_end = formatDate(newDates[newDates.length - 1]);
  emit('update:modelValue', {
    datetime_start: newDates[0]?.toISOString(),
    datetime_end: newDates[newDates.length - 1].toISOString(),
  })
};


const clearDateRange = () => {
  model.datetime_start = undefined
  model.datetime_end = undefined
  dates.value = undefined
  emit('update:modelValue', undefined)
}

// Función para confirmar la selección de fecha
const confirmDate = () => {
  showDatePicker.value = false;
};

// Observa los cambios de 'dates' para actualizar 'datetime_start' y 'datetime_end'
watch(dates, (newDates) => {
  if (newDates) {
    updateDateRange(newDates);
  }
}, { immediate: true });



</script>

<template>
  <div class="flex flex-col gap-2 w-full mt-auto">
    <label v-if="label" class="font-bold">{{ props.label }} <span v-if="required" class="text-red-600">*</span></label>
    <v-text-field
        v-model="dateRangeText"
        prepend-inner-icon="mdi-calendar"
        :placeholder="placeholder"
        variant="outlined"
        @click="showDatePicker = true"
        locales="es"
        clearable
        readonly
        @click:clear="clearDateRange"
    ></v-text-field>

  </div>
  <v-dialog v-model="showDatePicker" width="400px" class="flex">
    <v-card class="m-auto">
      <v-locale-provider locale="es">
        <v-date-picker
            landscape
            hide-header
            v-model="dates"
            multiple="range"
            @change="updateDateRange"
            :title-date-format="{ weekday: 'short', month: 'short', day: 'numeric' }"
        ></v-date-picker>
      </v-locale-provider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="showDatePicker = false">Cancelar</v-btn>
        <v-btn color="primary" @click="confirmDate">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>
