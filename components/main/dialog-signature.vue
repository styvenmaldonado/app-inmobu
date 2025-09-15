<script setup lang="ts">
import {useSignatureMachineActor} from "~/composables/useSignatureMachineActor";
import Camera from "simple-vue-camera";
import {useCameraHandler} from "~/composables/useCameraHandler";
import { putObject } from "~/hooks/useS3Services";
import { useGlobalUIStore } from "~/stores/ui.store";

const UIStore = useGlobalUIStore()

// Composables
const { camera, getPhoto, stop, devices, onStart, deviceIdSelected } = useCameraHandler();
const { reset, getCanvasData , signaturePad, isEmpty } = useDrawingCanvasHandler();
const { send } =  await useSignatureMachineActor();

const dialogName = 'dialog-signature';

const capturingScannedSignature = async () => {
  UIStore.showLoading();
  UIStore.nextStep();
 const {  buffer, base64 } = await getCanvasData();
  const {data : hash } = await putObject({
    fileBuffer: buffer,
    contentType: "image/png"
   })
  await send({type: 'CAPTURING_SCANNED_SIGNATURE', payload: {hash: hash.value, base64}})
}

const capturePhoto = async () => {
  UIStore.showLoading();
  const { buffer, base64 } = await getPhoto();
  const { data: hash } = await putObject({
    fileBuffer: buffer,
    contentType: "image/png"
  })
  stop();
  await send({type: 'CAPTURING_PHOTO', payload: {hash: hash.value, base64}})
  UIStore.hideLoading()
  UIStore.closeDialog()
}


</script>
<template>
  <mtm-dialog :dialogName="dialogName" size="full">
    <template v-slot:header>
      <mtm-title title="Firma" description="Informacion de tu Organizacion" icon="mdi-draw"/>
      <div class="ml-auto flex items-center"></div>
    </template>
    <template v-slot:body>
      <div class="w-full h-full flex">
        <mtm-steper-blank :step="UIStore.step">
          <template v-slot:item.1 class="flex flex-col h-full">
            <div class="flex flex-col gap-6  w-full h-full">
              <div class="w-full h-full p-4 rounded-lg border border-gray-300 flex m-auto relative">
                  <SignaturePad v-model="signaturePad" @update:isEmpty="isEmpty = $event"/>
              </div>
              <mtm-flex-container position="right">
                <div class="w-40">
                  <mtm-button-white icon="mdi-eraser" @click="() => reset()"/>
                </div>
                <mtm-button-white text="Cancelar" @click="UIStore.closeDialog()"/>
                <mtm-submit-button :disabled="isEmpty " text="Siguiente" @click="capturingScannedSignature"/>
              </mtm-flex-container>
            </div>
          </template>
          <template v-slot:item.2>
            <div class="w-full h-fit flex flex-col gap-4">
              <div class="h-fit w-fit mx-auto flex flex-col">
                <mtm-progress-circular v-show="!devices"/>
                <mtm-autocomplete
                    v-model="deviceIdSelected"
                    prepend_inner_icon="mdi-video-outline"
                    :items="devices|| []"
                    items_title="label"
                    density="compact"
                    return_object
                />
                <Camera ref="camera"  :resolution="{ width: 300, height: 350 }" autoplay @started="onStart"/>
              </div>
              <mtm-submit-button icon="mdi-camera" text="Añadir Registro Fotografico" @click="capturePhoto"/>

            </div>
          </template>
        </mtm-steper-blank>
      </div>
    </template>
    <template v-slot:submit>
    </template>
  </mtm-dialog>
</template>