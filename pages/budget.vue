<script setup lang="ts">
import MainContainer from "~/layouts/MainContainer.vue";
import FeeCalculator from "~/utils/FeeCalculator";
import feeConfig from "~/feeConfig.json";
import UiSubmitButton from "~/components/main/ui-submit-button.vue";
import UiSpace from "~/components/main/ui-space.vue";
import UiProgressCircular from "~/components/main/ui-progress-circular.vue";

const dataStore = useDataStore();
const route = useRoute();

onMounted(() => {
  dataStore.initialize({
    rent: route.query?.rent,
    quota: route.query?.quota
  })
})

const parsedAmount = computed(() => {
  const amountStr = route.query?.rent;
  const amount = typeof amountStr === 'string' ? parseInt(amountStr, 10) : 0;
  return isNaN(amount) || amount < 0 ? 0 : amount;
});

const fee = computed(() => {
  return FeeCalculator.calculateDefaultFee(parsedAmount.value)
})

const schedulePayments = computed(() => {
  return FeeCalculator.generateSchedulePayments(parsedAmount.value);
});

const onNext = async () => {
   await navigateTo({
     path: "/init",
     query: {
       rent: dataStore.initial.rent,
       quotas: schedulePayments.value![dataStore.initial!.quotaPaymentIndexSelected]?.paymentQuota
     }
   })
}
</script>
<template>
  <MainContainer>
    <div class="flex flex-col gap-6 px-5 pt-20">
      <section class="flex flex-col gap-3">
        <div>
          <h1 class="text-3xl lg:text-5xl font-bold leading-8">Cotiza tu <span class="text-blue-600">fianza</span></h1>
          <h2 class="text-xl leading-6">Somos el fiador solvente con finca raiz que necesitas</h2>
        </div>
        {{}}
        <div class="w-full py-8 bg-gray-100 rounded-lg p-5 ">
          <div class="flex">
           <span class="text-center w-full text-black font-black text-4xl">{{
               new Intl.NumberFormat('es-CO', {
                 style: 'currency',
                 currency: 'COP',
                 minimumFractionDigits: 0
               }).format(fee)
             }} COP</span>
          </div>
          <div class="leading-4 flex flex-col mt-4">
            <p class="text-xs text-gray-600 ">* Precio Incluye IVA</p>
            <p class="text-xs text-gray-600 ">* Valor fianza para contrato de arrendamiento 12 meses</p>
            <p class="text-xs text-gray-600 ">* Obligación de renovación: La fianza debe renovarse cada año mientras tu
              contrato de arrendamiento se encuentre vigente </p>
          </div>
        </div>
      </section>
      <ui-progress-circular v-if="!dataStore.initial"/>
      <section
          v-if="dataStore.initial"
          class="w-full"
      >
        <div class="pb-4">
          <h4 class="text-3xl font-bold text-black">Paga tu fianza a <span class="text-blue-600">cuotas</span></h4>
          <p class="text-xs text-gray-600 ">* Tasa de interés
            <span>
              {{  new Intl.NumberFormat('es-CO', {
              style: 'percent',
              minimumFractionDigits: 2
            }).format(feeConfig.TEA)}}
            </span>
             EA</p>
        </div>

        <v-radio-group
            class="w-full"
            v-model="dataStore.initial!.quotaPaymentIndexSelected "
        >
          <div v-for="(_schedulePayments, index) in schedulePayments" class="w-full">
            <button @click="dataStore.initial.quotaPaymentIndexSelected = index"
                    :class="dataStore.initial.quotaPaymentIndexSelected == index ? 'rounded-lg shadow-xl flex gap-2 px-3 py-2 border border-gray-50 bg-gray-50 my-2 w-full' : 'rounded-lg shadow-sm flex gap-2 px-3 py-2 border border-gray-50 my-2 w-full'">
              <v-radio :value="index"></v-radio>
              <div class="flex flex-col  leading-4 text-left">
                  <span
                      :class="dataStore.initial.quotaPaymentIndexSelected == index ? 'text-2xl font-black text-blue-600' : 'text-2xl font-black text-gray-400'">
                    {{ _schedulePayments.paymentQuota }}
                  </span>
                <span class="text-xs leading-4">Cuotas Mensuales</span>
              </div>
              <div v-if="!_schedulePayments.discountText" class="w-full flex">
                <div class="ml-auto flex flex-col leading-4 ">
                  <span v-if="!_schedulePayments.discountText"
                        :class="dataStore.initial.quotaPaymentIndexSelected == index ? 'font-black text-xl text-blue-600 text-right' : 'font-black text-xl text-gray-400 text-right'">
                 {{
                      new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0
                      }).format(Math.round(_schedulePayments.feeMonthly))
                    }}
               </span>
                  <span class="text-sm text-right">Total a pagar <span class="font-bold">{{
                      new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0
                      }).format(Math.floor(_schedulePayments.totalFee))
                    }}</span></span>
                </div>
              </div>
              <div v-else class="w-full flex">
                <div class="ml-auto flex flex-col leading-4 ">
                  <span class="text-sm text-right text-blue-600 font-bold">{{ _schedulePayments.discountText }}</span>
                  <div
                      :class="dataStore.initial.quotaPaymentIndexSelected == index ? 'font-black text-xl text-blue-600 text-right' : 'font-black text-xl text-gray-400 text-right'">
                    <span>
                      {{
                        new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          minimumFractionDigits: 0
                        }).format(Math.round(_schedulePayments.paymentWithDiscount))
                      }}
                    </span>
               </div>
                  <span class="text-sm text-right">Total a pagar <span class="font-bold">{{
                      new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0
                      }).format(_schedulePayments.paymentWithDiscount)
                    }}</span></span>

                </div>
              </div>
            </button>
          </div>
        </v-radio-group>
      </section>
      <ui-submit-button text="Iniciar estudio GRATIS" @click="onNext" />
      <ui-space size="large"/>
    </div>
  </MainContainer>
</template>

