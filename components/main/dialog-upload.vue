<script setup lang="ts">
import { useGlobalUIStore } from "~/stores/ui.store";

const UIStore = useGlobalUIStore()

const dialogName = 'dialog-upload';
const { send  } = useSignatureMachineActor();
const files = ref()

const onSubmit = async () => {
  await send({type: 'UPLOAD_FILES', payload:  files.value })
  UIStore.closeDialog()
}



</script>
<template>
  <mtm-dialog :dialogName="dialogName" size="full">
    <template v-slot:header>
      <mtm-title title="Cargar Documento" description="Informacion de tu Organizacion" icon="mdi-upload"/>
      <div class="ml-auto flex items-center"></div>
    </template>
    <template v-slot:body>
      <div class="w-full flex flex-col">
        <mtm-dropzone
            v-model="files"
            accept="application/pdf"
        />
        <mtm-submit-button
            v-if="files?.length"
            text="Enviar"
            @click="onSubmit"
        />
      </div>
    </template>
    <template v-slot:submit>
    </template>
  </mtm-dialog>
</template>