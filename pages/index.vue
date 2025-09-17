<script setup lang="ts">
import MainContainer from "~/layouts/MainContainer.vue";
import feeConfig from "~/feeConfig.json";
import FAQ from "~/FAQ.json";
import { useDataStore } from "~/stores/data.store";
import type {SubmitEventPromise} from "vuetify/framework";
import UiProgressCircular from "~/components/main/ui-progress-circular.vue";
import UiInputMoney from "~/components/main/ui-input-money.vue";


const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ.map(item => ({
    "@type": "Question",
    "name": item.title,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.text
    }
  }))
};


useHead({
  title: 'Inmobu | Tu Fiador y Codeudor para Arrendar',
  meta: [
    { name: 'description', content: '¿Necesitas un fiador para arrendar? Inmobu es tu codeudor solidario en Colombia. Olvídate de los requisitos y consigue el inmueble de tus sueños. ¡Aplica online!' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(faqSchema)
    }
  ]
});



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

</script>
<template>
  <MainContainer>
    <div class="flex flex-col gap-3">
      <section class="flex h-screen">
        <div class="flex flex-col gap-3 m-auto px-5">
          <div class="flex flex-col gap-3">
            <div class="flex gap-2">
              <span class="text-white w-fit px-4 py-2 rounded-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-500">Sin Anticipos</span>
              <span class="text-blue-600 border-2 border-blue-600 w-fit px-2 py-2 rounded-lg font-bold">100% Virtual</span>
            </div>
            <h1 class="text-4xl lg:text-5xl font-bold leading-9">Arrienda tu espacio ideal, <span class="text-blue-600">sin pedirle favores a nadie.</span></h1>
            <h2 class="text-xl leading-6">Nos convertimos en tu <span class="text-blue-600 font-bold">fiador y/o codeudor solidario</span> ante propietarios, inmobiliarias y aseguradoras para que arriendes donde quieras. Rápido, 100% digital y sin pagar por adelantado.</h2>
          </div>
          <p class="text-xs text-gray-600 mt-2">* Cotiza la fianza ingresando el valor estimado del arriendo mensual</p>
          <ui-progress-circular v-if="!dataStore.initial"/>
          <div v-else>
            <v-form @submit.prevent="onSubmit">
              <ui-input-money
                  v-model="dataStore.initial!.rent"
                  label="Arriendo Mensual"
                  required
              />
              <button class="bg-blue-600 py-4 w-full font-black rounded-lg text-white shadow-lg">Cotiza tu fianza</button>
            </v-form>
          </div>
        </div>
      </section>
      <section class="flex bg-gray-100">
        <div class="flex flex-col gap-3 m-auto px-5 py-20">
          <div class="flex flex-col gap-3">
            <h3 class="text-4xl lg:text-5xl font-bold leading-9">Olvídate de los <span class="text-blue-600">codeudores</span>. Nosotros confiamos en ti.</h3>
            <h4 class="text-xl leading-6">Un rápido análisis de tu perfil es todo lo que se necesita para nuestro respaldo.</h4>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
            <section class="rounded-lg p-5 bg-white">
              <div class="bg-blue-100 rounded-lg h-12 w-12 text-blue-500 flex">
                <div class="m-auto"><v-icon>mdi-home-search-outline</v-icon></div>
              </div>
              <div class="pt-6">
                <span class="font-bold">Empieza a buscar tu apartamento ideal</span>
                <p>Te entregamos por adelantado la documentación completa de tu fiador o codeudor solidario para que ningún propietario te rechace</p>
              </div>
            </section>
            <section class="rounded-lg p-5 bg-white">
              <div class="bg-blue-100 rounded-lg h-12 w-12 text-blue-500 flex">
                <div class="m-auto"><v-icon>mdi-cash-multiple</v-icon></div>
              </div>
              <div class="pt-6">
                <span class="font-bold">Cero Anticipos</span>
                <p>Obtén hoy la documentación de tu fiador solidario y paga después. No requerimos adelantos de dinero para empezar.</p>
              </div>
            </section>
            <section class="rounded-lg p-5 bg-white">
              <div class="bg-blue-100 rounded-lg h-12 w-12 text-blue-500 flex">
                <div class="m-auto"><v-icon>mdi-finance</v-icon></div>
              </div>
              <div class="pt-6">
                <span class="font-bold">Financiación a tu Medida</span>
                <p>Sabemos que mudarse es costoso. Por eso, te ofrecemos planes de pago flexibles para que puedas pagar la prima de tu fianza en cómodas cuotas.</p>
              </div>
            </section>

          </div>
        </div>
      </section>
      <section id="como-funciona" class="py-20">
        <div class="container mx-auto px-6">
          <div class="text-center">
            <h2 class="text-3xl font-bold">Inmobu es tu llave. Así de fácil:</h2>
          </div>
          <div class="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            <!-- Step 1 -->
            <div class="text-center max-w-xs">
              <div class="bg-blue-100 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">1</div>
              <h3 class="mt-6 font-semibold text-xl">Aplica Online en Minutos</h3>
              <p class="mt-2 text-gray-600">Completa nuestra solicitud 100% digital. Sin papeleo, sin filas y sin pagar nada por adelantado.</p>
            </div>
            <!-- Step 2 -->
            <div class="text-center max-w-xs">
              <div class="bg-blue-100 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">2</div>
              <h3 class="mt-6 font-semibold text-xl">Recibe tu Certificado de Fianza</h3>
              <p class="mt-2 text-gray-600">Una vez pre-aprobado, te entregamos un certificado de fianza y los documentos necesarios del fiador o codeudor para que lo presentes en cualquier aseguradora, inmobiliaria o al propietario y busques tu nuevo hogar con total confianza.</p>
            </div>
            <!-- Step 3 -->
            <div class="text-center max-w-xs">
              <div class="bg-blue-100 text-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">3</div>
              <h3 class="mt-6 font-semibold text-xl">¡Firma tu Contrato!</h3>
              <p class="mt-2 text-gray-600">Cuando encuentres el apartamento ideal, nosotros nos encargamos. Firmamos como tu fiador y/o codeudor solidario. ¡Bienvenido a casa!</p>
            </div>
          </div>
        </div>
      </section>
      <section class="flex bg-gray-50" id="FAQ">
        <div class="flex flex-col gap-3 m-auto px-5 py-10">
          <div class="flex flex-col gap-3">
            <h3 class="text-4xl lg:text-5xl font-bold leading-9">FAQ - Preguntas Frecuentes</h3>
            <h4 class="text-xl leading-6">Resolvemos tus dudas</h4>
          </div>
          <div class="pt-4">
            <v-expansion-panels
             v-for="(faq, index) in FAQ"
            >
              <v-expansion-panel
                  :title="faq?.title"
                  :text="faq?.text"
              >
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </div>
      </section>
    </div>
  </MainContainer>
</template>

