<script setup lang="ts">
import {useSignatureMachineActor} from "~/composables/useSignatureMachineActor";
import Camera from "simple-vue-camera";
import {useCameraHandler} from "~/composables/useCameraHandler";
import { putObject } from "~/hooks/useS3Services";
import { useGlobalUIStore } from "~/stores/ui.store";

const UIStore = useGlobalUIStore()
const dialogName = 'dialog-message';


// Composables


</script>
<template>
  <mtm-dialog :dialogName="dialogName" size="full">

    <template v-slot:body>
      <div class="w-full h-full flex">

      </div>
    </template>
    <template v-slot:submit>
    </template>
  </mtm-dialog>
</template>