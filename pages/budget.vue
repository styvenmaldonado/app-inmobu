<script setup lang="ts">
import { computed, onMounted } from 'vue';
import MainContainer from "~/layouts/MainContainer.vue";
import FeeCalculator from "~/utils/FeeCalculator";
import feeConfig from "~/feeConfig.json";
import UiSubmitButton from "~/components/main/ui-submit-button.vue";
import UiSpace from "~/components/main/ui-space.vue";
import UiProgressCircular from "~/components/main/ui-progress-circular.vue";
import UiInputMoney from "~/components/main/ui-input-money.vue";

const dataStore = useDataStore();
const route = useRoute()

// --- OPTIMIZATION 1: Reusable Formatting Helper ---
// Avoid creating a new Intl.NumberFormat object on every render.
// This is more performant and keeps the template clean (DRY principle).
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(Math.round(value)); // Rounding logic is now centralized
};

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'percent',
    minimumFractionDigits: 2,
  }).format(value);
};


onMounted(() => {
  // No changes needed here, this logic is fine.
  dataStore.initialize({
    rent: route.query.rent || feeConfig.defaultRent ,
    quotaPaymentIndexSelected: 0
  });
});

// --- OPTIMIZATION 2: Simplified Parsing ---
// Use the unary plus (+) operator for a concise string-to-number conversion.
const parsedAmount = computed(() => {
  const amount = +(dataStore.initial?.rent ?? 0);
  return isNaN(amount) || amount < 0 ? 0 : amount;
});

const fee = computed(() => {
  return FeeCalculator.calculateDefaultFee(parsedAmount.value);
});

const schedulePayments = computed(() => {
  return FeeCalculator.generateSchedulePayments(parsedAmount.value);
});

// --- OPTIMIZATION 3: Getter for Selected Plan ---
// This computed property simplifies accessing the selected schedule in the template.
const selectedPaymentPlan = computed(() => {
  if (schedulePayments.value.length && dataStore.initial) {
    return schedulePayments.value[dataStore.initial.quotaPaymentIndexSelected];
  }
  return null;
});

const onNext = async () => {
  await navigateTo({
    path: "/form"
  });
};
</script>
<template>
  <MainContainer>
    <div class="flex flex-col gap-6 px-5 pt-20">
      <section class="flex flex-col gap-3">
        <div>
          <h1 class="text-3xl lg:text-5xl font-bold leading-8">Cotiza tu <span class="text-blue-600">fianza</span></h1>
          <h2 class="text-xl leading-6">Somos el fiador solvente con finca raiz que necesitas</h2>
        </div>
        <p class="text-xs text-gray-600 mt-2">* Cotiza la fianza ingresando el valor estimado del arriendo mensual</p>

        <ui-progress-circular v-if="!dataStore.initial"/>
        <div v-else>
          <ui-input-money
              v-model="dataStore.initial!.rent"
              label="Arriendo Mensual"
              required
          />
          <div class="w-full py-8 bg-gray-100 rounded-lg p-5 ">
            <div class="flex">
              <span class="text-center w-full text-black font-black text-4xl">{{ formatCurrency(fee) }} COP</span>
            </div>
            <div class="leading-4 flex flex-col mt-4">
              <p class="text-xs text-gray-600 ">* Precio Incluye IVA</p>
              <p class="text-xs text-gray-600 ">* Valor fianza para contrato de arrendamiento 12 meses</p>
              <p class="text-xs text-gray-600 ">* Obligación de renovación: La fianza debe renovarse cada año mientras tu contrato de arrendamiento se encuentre vigente </p>
            </div>
          </div>

          <section class="w-full pt-6">
            <div class="pb-4">
              <h4 class="text-3xl font-bold text-black">Paga tu fianza a <span class="text-blue-600">cuotas</span></h4>
              <p class="text-xs text-gray-600 ">* Tasa de interés <span>{{ formatPercent(feeConfig.TEA) }}</span> EA</p>
            </div>

            <v-radio-group
                v-if="dataStore.initial"
                class="w-full"
                v-model="dataStore.initial.quotaPaymentIndexSelected"
            >
              <label
                  v-for="(plan, index) in schedulePayments"
                  :key="index"
                  class="rounded-lg shadow-sm flex gap-2 px-3 py-2 border border-gray-50 my-2 w-full cursor-pointer transition-all"
                  :class="{ 'bg-gray-50! shadow-xl!': dataStore.initial.quotaPaymentIndexSelected === index }"
              >
                <v-radio :value="index" class="mt-1"></v-radio>

                <div class="flex flex-col leading-4 text-left">
                  <span class="text-2xl font-black transition-colors" :class="dataStore.initial.quotaPaymentIndexSelected === index ? 'text-blue-600' : 'text-gray-400'">
                    {{ plan.paymentQuota }}
                  </span>
                  <span class="text-xs leading-4">Cuotas Mensuales</span>
                </div>

                <div class="ml-auto flex flex-col leading-4 text-right w-full">
                  <span v-if="plan.discountText" class="text-sm text-blue-600 font-bold">{{ plan.discountText }}</span>

                  <div class="font-black text-xl transition-colors" :class="dataStore.initial.quotaPaymentIndexSelected === index ? 'text-blue-600' : 'text-gray-400'">
                    <span>{{ formatCurrency(plan.discountText ? plan.paymentWithDiscount : plan.feeMonthly) }}</span>
                  </div>

                  <span class="text-sm">Total a pagar <span class="font-bold">{{ formatCurrency(plan.discountText ? plan.paymentWithDiscount : plan.totalFee) }}</span></span>
                </div>
              </label>
            </v-radio-group>
          </section>
        </div>
        <ui-submit-button text="Solicita tu fianza AHORA" @click="onNext" />
        <ui-space size="large"/>
      </section>

    </div>
  </MainContainer>
</template>

