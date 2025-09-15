<script setup lang="ts">
const props = defineProps<{
    position?: "right",
    class?:string
}>()
</script>
<template>
    <div :class="`w-full flex h-fit ${props.class}`">
        <div :class="position == 'right' ? 'flex items-center ml-auto gap-x-4 w-fit' : 'flex items-center gap-x-4 w-full'">
            <slot></slot>
        </div>
    </div>
</template>