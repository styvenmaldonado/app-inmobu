<script setup>
import {useGlobalUIStore} from "~/stores/ui.store.js";
import UiHeader from "~/components/main/ui-header.vue";
import UiFooter from "~/components/main/ui-footer.vue";

const UIStore = useGlobalUIStore()

onMounted(() => {
     UIStore.reset()
})

const gtmId = 'GTM-5HSJGL4M';

useHead({
  // 1. Script para la sección <head>
  script: [
    {
      // Usamos innerHTML para pegar el script de GTM directamente
      innerHTML: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `,
      // Es importante especificar el tipo de script
      type: 'text/javascript',
    },
  ],
  // 2. Noscript para la sección <body>
  noscript: [
    {
      // El contenido del noscript va en el innerHTML
      innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
      // Nuxt colocará esto justo después de la etiqueta de apertura <body>
      tagPosition: 'bodyOpen',
    }
  ]
})

</script>
<template>
  <div class="block">
    <ui-header/>
    <div class="flex flex-col lg:flex-row w-full h-full">
      <div class="w-full h-full overflow-y-auto">
        <slot></slot>
      </div>
    </div>
    <ui-footer/>
  </div>
</template>