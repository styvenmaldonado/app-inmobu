<script setup lang="ts">
const props = defineProps<{
  dialogName: string;
  size: "small" | "large" | "full";
}>();

const UIStore = useGlobalUIStore();
const classComputed = computed(()=> {
  switch (props.size) {
    case 'small':
      return 'w-2/3 h-2/3 m-auto';
    case 'large':
      return 'w-5/6 h-5/6 m-auto';
    case 'full':
      return 'w-full h-full m-auto';
    default:
      break;
  }
})

</script>
<template>
  <v-dialog
    v-model="(UIStore.dialogs[dialogName] || {}).state"
    @update:model-value="()=> UIStore.closeDialog()"
    :class="classComputed"
  >
    <v-form>

    </v-form>
    <template v-slot:activator="{ props: activatorProps }">
      <slot name="button"></slot>
    </template>
    <div :class="'bg-white rounded-lg flex flex-col overflow-y-auto'">
      <div class="flex items-center h-full border-b border-gray-200 px-8 py-4">
        <slot name="header"></slot>
        <div class="ml-auto flex items-center">
          <mtm-button-close @click="UIStore.closeDialog()" />
        </div>
      </div>
      <div class="overflow-y-auto p-8">
        <slot name="body">
        </slot>
      </div>
      <div class="p-8">
        <slot name="submit"> </slot>
      </div>
    </div>
  </v-dialog>
</template>
