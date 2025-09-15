<script setup lang="ts">
import { useDropzone } from "vue3-dropzone";
import type { FileRejectReason, FileUploadOptions } from "vue3-dropzone";

const emit = defineEmits(['update:modelValue']);


const props = defineProps<{
  modelValue?: any[];
  buttonText?: string;
  accept?: string | string[];
  maxFiles?: number;
  maxSize?: number;
  multiple?: boolean;
}>();

const _files: Ref<Array<File | string>> = ref(props.modelValue || []);
const loading: Ref<boolean> = ref(false);

const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop ,
  accept: props.accept,
  maxFiles: props.maxFiles,
  maxSize: props.maxSize,
  multiple: props.multiple || false
});

function onDrop(acceptFiles: File[], rejectReasons: FileRejectReason[]) {
  // Filtrar archivos duplicados
  const newFiles = acceptFiles.filter(
      (file) => !_files.value.some((existingFile) => existingFile.name === file.name)
  );

  // Notificar sobre archivos rechazados
  if (rejectReasons.length > 0) {
    console.warn("Archivos rechazados:", rejectReasons);
    // Aquí puedes emitir un evento o mostrar un mensaje al usuario sobre los errores
    // emit("fileRejection", rejectReasons);
  }

  // Sólo actualizar si hay archivos nuevos
  if (newFiles.length > 0) {
    _files.value = [..._files.value, ...newFiles];
    emit("update:modelValue", _files.value);
  }
}

function convertFileSizeToMB(sizeInBytes?: number): string {
  if (!sizeInBytes) {
    return "0 MB";
  }
  const sizeInMB = sizeInBytes / (1024 * 1024); // Conversión de bytes a MB
  return `${sizeInMB.toFixed(2)} MB`; // Formatear a 2 decimales
}


const onRemoveFile = (file: File | string) => {
  // Encontrar y filtrar el archivo en la lista actual
  const updatedFiles = _files.value.filter(
      (currentFile) =>
          typeof file === "string"
              ? currentFile !== file // Eliminación basada en strings
              : currentFile instanceof File && currentFile.name !== file.name // Comparación por nombre de archivo (para objetos File)
  );

  // Validar si hubo un cambio en la lista antes de actualizar
  if (updatedFiles.length !== _files.value.length) {
    _files.value = updatedFiles; // Actualizar los archivos
    emit("update:modelValue", _files.value); // Emitir el cambio
  }
};

</script>
<template>
  <div class="w-full h-full">
    <div
      class="bg-slate-100 rounded-lg p-12 border-dashed border-2 border-sky-500 h-full flex"
      v-bind="getRootProps()"
    ><input v-bind="getInputProps()" />
      <div class="flex flex-col items-center gap-4 m-auto">
        <v-icon size="large">mdi-cloud-upload-outline</v-icon>
        <p>
          Arrastre y suelte algunos archivos aquí, o haga clic para seleccionar
          archivos
        </p>
      </div>
    </div>
    <div class="w-full flex flex-col gap-4 py-4">
      <div  v-for="(file, index) in _files" :key="index" class="flex gap-4 items-center w-full px-4 py-8 border rounded-lg">
        <div><v-icon>mdi-file-check</v-icon></div>
        <div class="flex flex-col w-full">
          <span class="font-bold">{{file?.name}}</span>
          <span>{{convertFileSizeToMB(file?.size)}}</span>
        </div>
        <button
            @click="onRemoveFile(file)"
            class="px-4"
        >
          <v-icon>mdi-close</v-icon>
        </button>
      </div>
    </div>

  </div>
</template>
