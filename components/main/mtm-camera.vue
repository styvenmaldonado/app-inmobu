<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps } from 'vue';
import Camera from 'simple-vue-camera';

defineProps<{
  resolution: { width: number, height: number },
  camera: Ref<InstanceType<typeof Camera> | null>;
}>();

const UIStore = useGlobalUIStore();
const camera = ref<InstanceType<typeof Camera> | null>(null);

const snapshot = async () => {
  try {
    if (camera.value) {
      const blob:Blob = await camera.value.snapshot() || new Blob();
      console.log(blob)
    }
  } catch (error) {
    console.error('Error taking a snapshot:', error);
  }
};

onUnmounted(() => {
  if (camera.value) {
    camera.value.stop();
  }
});
</script>

<template>
  <div v-if="UIStore.isLoading" :style="{ width: resolution.width + 'px', height: resolution.height + 'px' }"></div>
  <Camera ref="camera" :resolution="{ width: resolution.width, height: resolution.height }" autoplay @started="UIStore.hideLoading()"  />
  <button @click="snapshot">Snapshot</button>
</template>