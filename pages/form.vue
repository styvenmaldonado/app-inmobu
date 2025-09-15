<script setup lang="ts">
import MainContainer from "~/layouts/MainContainer.vue";
import UiSubmitButton from "~/components/main/ui-submit-button.vue";
import UiSpace from "~/components/main/ui-space.vue";
import UiSteperBlank from "~/components/main/ui-steper-blank.vue";
import UiAutocomplete from "~/components/main/ui-autocomplete.vue";
import type {SubmitEventPromise} from "vuetify";
import UiInput from "~/components/main/ui-input.vue";


const dataStore = useDataStore();
const route = useRoute();
const UIStore = useGlobalUIStore();

onMounted(() => {
  UIStore.initialize();
  dataStore.initialize({
    amount: route.query?.amount,
    quota: route.query?.quota
  })
})

const onSubmit = async (e: SubmitEventPromise) => {
  const {valid} = await e;
  if (!valid) return;
  UIStore.nextStep()
}
const sendData = async () => {
  try {
    const response = await fetch('https://sheetdb.io/api/v1/wga7icn1ps8bd', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // Convierte el objeto JavaScript a una cadena de texto JSON
      body: JSON.stringify({
        data: [{...dataStore.initial}]
      })
    });

    // Opcional: para verificar la respuesta del servidor
    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error('Hubo un error con la solicitud fetch:', error);
  }
};

</script>
<template>
  <MainContainer>
    <div class="flex flex-col gap-6 px-5 pt-32">
      <section class="flex flex-col gap-8">
        <div>
          <h1 class="text-3xl lg:text-5xl font-bold leading-8">Confirma tus <span class="text-blue-600">datos personales</span></h1>
          <h2 class="text-xl leading-6">Necesitamos tus datos para completar tu solicitud.</h2>
        </div>

        <ui-steper-blank v-if="dataStore.initial" :step="UIStore.step">
          <template #item.1>
            <v-form @submit.prevent="onSubmit">
              <ui-input label="Número de teléfono" v-model="dataStore.initial!.phone" required type="number"/>
              <ui-submit-button text="Siguiente"/>
            </v-form>
          </template>
          <template #item.2>
            <v-form @submit.prevent="onSubmit">
              <div class="flex flex-col gap-3 h-full">
                <ui-autocomplete
                    label="Tipo de Documento"
                    v-model="dataStore.initial!.type_id"
                    :items="[
                      {text:'CC - Cédula de Ciudadanía', value:'01'},
                      {text:'CE - Cédula de Extranjería', value:'02'}
                      ]"
                    required/>
                <ui-input label="Numero Documento" v-model="dataStore.initial!.id" required type="number"/>
                <ui-input label="Fecha de Expedicion" v-model="dataStore.initial!.expirationDateId"  required type="date"/>
                <ui-submit-button text="Siguiente" />
              </div>
            </v-form>
          </template>
          <template #item.3>
            <v-form @submit.prevent="onSubmit">
            <div class="flex flex-col gap-3 h-full">
                <ui-input label="Apellidos" v-model="dataStore.initial!.last_name"  required/>
                <ui-input label="Nombres" v-model="dataStore.initial!.given_name"  required/>
                <ui-input label="Correo Electronico" v-model="dataStore.initial!.email"  required/>
                <ui-autocomplete
                    label="Genero"
                    v-model="dataStore.initial!.gender"
                    :items="[
                      {text:'Masculino', value:'01'},
                      {text:'Femenino', value:'02'},
                      {text:'Otro', value:'03'},
                      ]"
                    required/>
                <ui-input label="Fecha de Nacimiento" v-model="dataStore.initial!.birthDate"  required type="date"/>
                <ui-submit-button text="Siguiente" />
            </div>
            </v-form>
          </template>
          <template #item.4>
            <v-form @submit.prevent="sendData" >
              <div class="flex flex-col gap-3 h-full">
                <ui-autocomplete
                    label="Ocupación"
                    v-model="dataStore.initial!.employment_status"
                    :items="[
                      {text:'Independiente', value:'01'},
                      {text:'Empleado(a)', value:'02'},
                      {text:'Pensionado(a)', value:'03'},
                      {text:'Estudiante', value:'04'},
                      ]"
                    required/>
                <ui-submit-button text="Siguiente" />
              </div>
            </v-form>
          </template>
        </ui-steper-blank>
        <ui-space size="large"/>
      </section>
      <ui-space size="large"/>
    </div>
  </MainContainer>
</template>

