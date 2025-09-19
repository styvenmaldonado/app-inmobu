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
  await navigateTo({
    path: "/form",
  })
};

const onBudget = async (e: SubmitEventPromise) => {
  await navigateTo({
    path: "/budget",
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
            <h1 class="text-3xl lg:text-5xl font-bold leading-8">Arrienda tu espacio ideal, <span class="text-blue-600">sin pedirle favores a nadie.</span></h1>
            <h2 class="text-xl leading-6">Nos convertimos en tu <span class="text-blue-600 font-bold">fiador y/o codeudor solidario</span> ante propietarios, inmobiliarias y aseguradoras para que arriendes donde quieras. Rápido, 100% digital y sin pagar por adelantado.</h2>
          </div>
          <div class="py-8 flex flex-col gap-4">
            <button @click="onSubmit" class="bg-blue-600 py-4 w-full font-black rounded-lg text-white shadow-lg text-lg">Solicita tu Fianza Ahora</button>
            <button @click="onBudget" class="text-blue-600 py-4 w-full font-black rounded-lg  shadow-lg text-lg border border-gray-50">Cotiza tu fianza</button>
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
      <section class="bg-gradient-to-r from-violet-600 to-indigo-600 py-16 sm:py-24">
        <div class="mx-auto max-w-2xl px-6 lg:px-8">

          <div class="text-center">

            <h2 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              ¿Listo para tu nuevo hogar?
            </h2>
            <p class="mt-5 text-lg leading-8 text-blue-200">
              Tu fianza de arriendo aprobada en minutos. Obtén tu cotización al instante.
            </p>

            <div class="mt-10">
              <a href="/budget" class="w-full sm:w-auto inline-block rounded-lg bg-white px-12 py-4 text-lg font-semibold text-blue-700 shadow-lg hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
               Cotiza tu fianza Ahora
              </a>
              <p class="mt-4 text-sm text-blue-300">
                Sin compromisos.
              </p>
            </div>

          </div>

          <div class="mt-16 border-t border-blue-700 pt-10">
            <div class="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">

              <div class="flex flex-col items-center gap-2">
                <svg class="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium text-blue-100">Rápido y Fácil</span>
              </div>

              <div class="flex flex-col items-center gap-2">
                <svg class="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
                </svg>
                <span class="text-sm font-medium text-blue-100">100% Seguro</span>
              </div>
            </div>
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

