<script setup lang="ts">
import MainContainer from "~/layouts/MainContainer.vue";
import feeConfig from "~/feeConfig.json";
import privacy from "~/privacy.json";

import type {SubmitEventPromise} from "vuetify/framework";

const dataStore = useDataStore();

onMounted(() => {
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

</script>
<template>x
  <MainContainer>
    <div class="flex flex-col gap-3 pt-20 lg:pt-28">
      <section class="flex ">
        <div class="flex flex-col gap-3 m-auto px-5 lg:px-20">
          <div class="flex flex-col gap-3">
            <h1 class="text-4xl lg:text-5xl font-bold leading-9">Política de privacidad de <span class="text-blue-600">Inmobu Colombia.</span></h1>
           <div class="py-6">
             <div class="text-black  text-sm">
               {{ privacy.text }}
             </div>
           </div>
          </div>
        </div>
      </section>

    </div>
  </MainContainer>
</template>

