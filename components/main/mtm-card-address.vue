<script setup lang="ts">
import type { Address } from 'fhir/r5';
import {usePatientStore} from "~/stores/patientStore";

// Propiedades para pasar la dirección y el índice del componente padre
const props= defineProps<{
  address: Address;
  index: number;
}>();

const patientStore = usePatientStore();
const UIStore = useGlobalUIStore();
const addressStore = useAddressStore();


// Funcionalidad externa reutilizable
const { getMask, loadItems } = useTextMask(); // Seguir dependiendo de esta utilidad externa

onMounted(() => {
  loadItems(['contact-point-use']);
});

// Computed para formatear la dirección y minimizar lógica en el template
const formattedAddress = computed(() => {
  if (!props.address) return '';

  // Combina la dirección en una sola cadena
  const { line = [], city, state, postalCode, country } = props.address;
  return [
    line.join(', '),
    city,
    state,
    postalCode,
    country,
  ]
      .filter(Boolean) // Elimina valores vacíos o nulos
      .join(', ');
});

const onEdit = () => {
  UIStore.openDialog({
    dialogName: 'dialog-address-patient-form',
    action: 'edit',
    index: props.index,
  })
  addressStore.set(props.address)
}


</script>

<template>
  <div class="address-card">
    <div class="flex border border-gray-200 rounded-lg px-6 py-8 shadow-lg gap-6">
      <div class="flex flex-col w-full">
        <!-- Título de la dirección -->
        <span class="font-bold">
          Dirección ({{ getMask('contact-point-use', address.use) }})
        </span>

        <!-- Información formateada -->
        <span>{{ formattedAddress }}</span>
      </div>

      <!-- Acciones -->
      <div class="flex gap-x-2 items-center">
        <button
            class="underline"
            aria-label="Editar dirección"
            @click="onEdit"
        >
          Editar
        </button>
        <div>|</div>
        <button
            class="underline"
            @click="patientStore.removeAddress(index)"
            aria-label="Eliminar dirección"
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
</template>
