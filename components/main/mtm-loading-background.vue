<script setup lang="ts">
const UIStore = useGlobalUIStore()


</script>

<template>
  <Teleport to="body">
    <div
        v-show="UIStore.isLoading"
        class="bg-white opacity-90 w-screen h-screen fixed top-0 left-0 flex"
        style="z-index: 99999"
    >
      <div class="m-auto">
        <v-progress-circular
            color="primary"
            indeterminate
            :size="118"
            :width="11"
        ></v-progress-circular>
      </div>
    </div>
  </Teleport>
</template>