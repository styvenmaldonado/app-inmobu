<script setup lang="ts">
import MainContainer from "~/layouts/MainContainer.vue";
import feeConfig from "~/feeConfig.json";
import FAQ from "~/FAQ.json";
import { useDataStore } from "~/stores/data.store";
import type {SubmitEventPromise} from "vuetify/framework";
import UiProgressCircular from "~/components/main/ui-progress-circular.vue";
import UiInputMoney from "~/components/main/ui-input-money.vue";
import UiSpace from "~/components/main/ui-space.vue";
import UiSteperBlank from "~/components/main/ui-steper-blank.vue";
import UiInput from "~/components/main/ui-input.vue";
import UiSubmitButton from "~/components/main/ui-submit-button.vue";
import UiAutocomplete from "~/components/main/ui-autocomplete.vue";

const dataStore = useDataStore();

onMounted(()=> {
  dataStore.initialize({
    rent: feeConfig.defaultRent
  })
})

const onSubmit = async (e: SubmitEventPromise) => {
  const {valid} = await e;
  if (!valid) return;
  await navigateTo({
    path: "/budget",
    query: {
      rent: dataStore.initial.rent
    }
  })
};

const onClick = async () => {
  await navigateTo("/")
}

</script>
<template>
  <MainContainer>
    <div class="flex flex-col gap-6 px-5 pt-32 h-full">
      <section class="flex flex-col gap-8">
        <v-icon class="text-green-600" :size="100">mdi-check-circle-outline</v-icon>
        <div>
          <h1 class="text-3xl lg:text-5xl font-bold leading-8">Recibimos tu <span class="text-blue-600">información</span></h1>
          <h2 class="text-xl leading-6">Hemos recibido tu información correctamente. Nuestro equipo la analizará y te contactaremos en un plazo de 24 horas hábiles con el resultado de tu estudio financiero. Agradecemos tu confianza.</h2>
        </div>
        <ui-submit-button text="Finalizar" @click="onClick"/>
        <ui-space size="large"/>
      </section>
      <ui-space size="large"/>
    </div>
  </MainContainer>
</template>

