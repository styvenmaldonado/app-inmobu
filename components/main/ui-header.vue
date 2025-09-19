<script setup lang="ts">
//definePageMeta({ middleware: "authentication" });
import UiDivider from "~/components/main/ui-divider.vue";

const uiStore = useGlobalUIStore()
</script>

<template>
  <header>
    <div class="border-b px-3 py-3 flex items-center fixed top-0 left-0 w-full shadow-md bg-white"  style="z-index: 1000;">
      <a href="/"><img class="h-10" src="/logo.webp" alt="Inmobu" /></a>
      <div class="ml-auto">
        <v-layout>
          <v-navigation-drawer
              v-model="uiStore.drawer"
              mobile
              temporary
          >
            <div class="w-full h-full bg-white flex flex-col z-100 py-5 px-2">
              <img class="h-10 object-contain" src="/logo.webp" alt="Inmobu"/>
              <ui-divider/>
              <v-list density="compact" nav>
                <v-list-item title="Inicio" href="/"></v-list-item>
                <v-list-item title="Cotiza tu fianza" href="/budget"></v-list-item>
                <v-list-item title="FAQ - Preguntas Frecuentes" href="/#FAQ"></v-list-item>
                <v-divider></v-divider>
                <v-list-item title="Términos y Condiciones"  href="/terminos-y-condiciones"></v-list-item>
                <v-list-item  title="Política de Privacidad" href="/politica-privacidad"></v-list-item>
              </v-list>
            </div>


          </v-navigation-drawer>
          <v-main>
            <div class="mr-auto">
              <button  @click.stop="uiStore.drawer = !uiStore.drawer">
                <v-icon>mdi-menu</v-icon>
              </button>
            </div>
          </v-main>
        </v-layout>
      </div>
    </div>
  </header>
</template>
