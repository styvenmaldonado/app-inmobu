<script setup lang="ts">
import type {Address, PatientContact} from 'fhir/r5';
import {usePatientStore} from "~/stores/patientStore";

// Propiedades para pasar la dirección y el índice del componente padre
const props= defineProps<{
  contact: PatientContact;
  index: number;
}>();

const patientStore = usePatientStore();
const UIStore = useGlobalUIStore();
const contactStore = useContactStore();


// Funcionalidad externa reutilizable
const { getMask, loadItems } = useTextMask(); // Seguir dependiendo de esta utilidad externa

onMounted(() => {
  loadItems(['contact-point-use', 'contact-point-system']);
});


const formattedAddress = computed(() => {
  const address = props.contact.address;
  if (!address) return ''; // Si no hay dirección, devolver cadena vacía.

  // Desestructuración con valores predeterminados para mayor robustez.
  const { line = [], city = '', state = '', postalCode = '', country = '' } = address;

  // Combinar los campos ignorando valores vacíos.
  return [
    line.filter(Boolean).join(', '), // Asegurarse de filtrar líneas vacías en la dirección.
    city,
    state,
    postalCode,
    country,
  ]
      .filter(value => value.trim() !== '') // Filtra cualquier cadena vacía o con solo espacios.
      .join(', '); // Une los elementos con una coma y un espacio.
});

const onEdit = () => {
  UIStore.openDialog({
    dialogName: 'dialog-contact-patient-form',
    action: 'edit',
    index: props.index,
  })
  contactStore.set(props.contact)
}


</script>

<template>
  <div class="address-card">
    <div class="flex border border-gray-200 rounded-lg px-6 py-8 shadow-lg gap-6">
      <div class="flex flex-col w-full gap-y-2">
        <div class="flex gap-4 ">
          <div class="flex flex-col w-full">
            <span class="text-gray-600  text-sm ">Información Contacto</span>
            <span class="font-bold text-2xl">{{contact.name?.given?.join("")}} {{contact.name?.family}}</span>
            <div v-for="(relation,index) in contact.relationship">
              <span>{{ relation.text}}</span>
            </div>
          </div>
          <div class="flex gap-x-2 items-center ml-auto">
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
                @click="patientStore.removeContact(props.index)"
                aria-label="Eliminar dirección"
            >
              Eliminar
            </button>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-2">
          <div v-for="(telecom,index) in contact.telecom" class="flex flex-col gap-x-2">
            <span class="font-bold">{{ getMask('contact-point-system',telecom.system)  }} ({{ getMask('contact-point-use', telecom.use) }})</span>
            <span>{{ telecom.value}}</span>
          </div>
        </div>

        <div v-if="contact.address?.city">
          <mtm-divider/>
          <div class="flex flex-col">
               <span class="font-bold">Dirección ({{ getMask('contact-point-use', contact.address.use) }})</span>
               <span>{{ formattedAddress }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
