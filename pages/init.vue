<script setup lang="ts">
import MainContainer from "~/layouts/MainContainer.vue";
import UiSubmitButton from "~/components/main/ui-submit-button.vue";
import UiSpace from "~/components/main/ui-space.vue";
import type {SubmitEventPromise} from "vuetify";

const dataStore = useDataStore();
const route = useRoute();
const accepted = ref();
const rules = {
  required: value => !!value || 'Campo requerido.',
}

onMounted(() => {
  dataStore.initialize({
     state: false
  })
})

const onNext = async  (e: SubmitEventPromise) => {
  const {valid} = await e;
  if (!valid) return;
  await navigateTo({
    path: "/form",
    query: {
      rent: route.query.rent,
      quotas:route.query.quotas
    }
  })
}


</script>
<template>
  <MainContainer>
    <div class="flex flex-col gap-6 px-5 pt-32">
      <section class="flex flex-col gap-8">
        <div>
          <h1 class="text-3xl lg:text-5xl font-bold leading-8">Requisitos <span class="text-blue-600">fianza</span></h1>
          <h2 class="text-xl leading-6">Un rápido análisis de tu perfil es todo lo que se necesita para nuestro
            respaldo.</h2>
        </div>
        <div class="flex flex-col gap-3 h-full">
          <div class="flex gap-3 items-center">
            <v-icon class="text-blue-600">mdi-file-chart-outline</v-icon>
            <span class="leading-5 text-lg">No debes tener <span class="font-bold">reportes negativos</span> en centrales de riesgo (Datacredito, TransUnion)  </span>
          </div>
          <div class="flex gap-3 items-center">
            <v-icon class="text-blue-600">mdi-finance</v-icon>
            <span class="leading-5 text-lg">Debes demostrar el  <span class="font-bold">2x doble de ingresos</span> del canon de arrendamiento </span>
          </div>
          <div class="flex gap-3 items-center">
            <v-icon class="text-blue-600">mdi-account-group</v-icon>
            <span class="leading-5 text-lg"><span class="font-bold">4 referencias </span> personales o familiares</span>
          </div>
          <span class="text-gray-600 leading-4 text-sm"> * La aprobación de la fianza está sujeta a criterios de elegibilidad de Inmobu. Conoce nuestros <a
              href="/terminos-y-condiciones" class="text-blue-600 underline">términos y condiciones</a>.</span>
        </div>
        <div>
          <v-form @submit.prevent="onNext">
            <v-container fluid>
              <v-checkbox
                  v-model="accepted"
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
                href="/politica-de-privacidad"
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
            <ui-submit-button text="Iniciar estudio GRATIS"/>
          </v-form>
        </div>
        <ui-space size="large"/>
      </section>
      <ui-progress-circular v-if="!dataStore.initial"/>
      <ui-space size="large"/>
    </div>
  </MainContainer>
</template>

