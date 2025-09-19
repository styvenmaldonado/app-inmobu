<script setup lang="ts">
import MainContainer from "~/layouts/MainContainer.vue";
import UiSubmitButton from "~/components/main/ui-submit-button.vue";
import UiSpace from "~/components/main/ui-space.vue";
import UiSteperBlank from "~/components/main/ui-steper-blank.vue";
import UiAutocomplete from "~/components/main/ui-autocomplete.vue";
import type {SubmitEventPromise} from "vuetify";
import UiInput from "~/components/main/ui-input.vue";
import UiLoadingBackground from "~/components/main/ui-loading-background.vue";


const dataStore = useDataStore();
const route = useRoute();
const UIStore = useGlobalUIStore();

onMounted(() => {
  UIStore.initialize();
  dataStore.initialize({
    accepted: null
  })
})

const rules = {
  required: value => !!value || 'Campo requerido.',
}

const onSubmit = async (e: SubmitEventPromise) => {
  const {valid} = await e;
  if (!valid) return;
  UIStore.nextStep()
}
const sendData = async (e: SubmitEventPromise) => {
  const {valid} = await e;
  if (!valid) return;
  try {
    UIStore.showLoading();

    if (dataStore.initial!.credit_historial == "yes") {
      await navigateTo('/result2')
    }

    if (dataStore.initial!.credit_historial == "no") {
      const response = await fetch('https://sheetdb.io/api/v1/obfj6gy1omjxy', {
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
      await navigateTo('/result')
    }


  } catch (error) {
    console.error('Hubo un error con la solicitud fetch:', error);
  }
};

</script>
<template>
  <MainContainer>
    <ui-loading-background/>
    <div class="flex flex-col gap-6 px-5 pt-32">
      <section class="flex flex-col gap-8">
        <div>
          <h1 class="text-3xl lg:text-5xl font-bold leading-8">Solicita tu fianza <span class="text-blue-600">ahora</span></h1>
          <h2 class="text-xl leading-6">Necesitamos tus datos para completar tu solicitud.</h2>
        </div>
        <ui-steper-blank v-if="dataStore.initial" :step="UIStore.step">
          <template #item.1>
            <v-form @submit.prevent="onSubmit">
              <ui-input label="Nombre" v-model="dataStore.initial!.given_name"  required/>
              <ui-input label="Fecha de Nacimiento" v-model="dataStore.initial!.birthDate"  required type="date"/>
              <ui-input label="Correo Electronico" v-model="dataStore.initial!.email"  required/>
              <ui-input label="Whatsapp" v-model="dataStore.initial!.phone" required type="number"/>
              <ui-submit-button text="Siguiente"/>
            </v-form>
          </template>
          <template #item.2>
            <v-form @submit.prevent="sendData">
              <p class="font-bold text-xl leading-6 pb-4">¿Tienes reportes negativos en centrales de riesgo (ej. Datacredito, TransUnion)?</p>
              <div class="flex flex-col gap-3 h-full">
                <v-radio-group
                    v-model="dataStore.initial!.credit_historial"
                    inline required
                    :rules="[rules.required]"
                >
                  <v-radio label="Si, estoy reportado" value="yes"></v-radio>
                  <v-radio label="No tengo reportes negativos" value="no"></v-radio>
                </v-radio-group>
              </div>
              <ui-space size="large"/>
              <v-container fluid>
                <v-checkbox
                    v-model="dataStore.initial!.accepted"
                    :rules="[rules.required]"
                >
                  <template v-slot:label>
              <span class="leading-5">
                He leído y acepto los
                <a
                    href="/terminos-y-condiciones"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-medium text-blue-600 underline hover:text-blue-700"
                    @click.stop
                >
                  Términos y Condiciones
                </a>
                y la
                <a
                    href="/politica--privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-medium text-blue-600 underline hover:text-blue-700"
                    @click.stop
                >
                  Política de Privacidad
                </a>
                de Inmobu.
              </span>
                  </template>
                </v-checkbox>
              </v-container>
              <ui-submit-button text="INICIAR"/>
            </v-form>
          </template>
        </ui-steper-blank>
      </section>
      <ui-space size="large"/>
    </div>
  </MainContainer>
</template>

