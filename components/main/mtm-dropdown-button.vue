<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'

defineProps<{
  title: string,
  icon?: string,
  menu?: {
    route: string,
    title: string,
    icon?: string
  }[]
}>()

</script>

<template>
  <Menu as="div" class="relative inline-block text-left w-full">
    <div>
      <MenuButton class="">
         <div class="bg-blue-600  w-auto py-3 px-4 rounded-lg shadow-lg text-white flex items-center gap-2 text-nowrap">
           <v-icon v-if="icon">{{ icon }}</v-icon>
           <span>{{ title }}</span>
           <v-icon>mdi-chevron-down</v-icon>
         </div>
      </MenuButton>
    </div>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95 ">
      <MenuItems class="rounded-lg shadow-lg bg-white flex flex-col gap-1 py-2 absolute z-00 w-96 right-0 border border-gray-100 mt-4">
            <div v-for="(item,index) in menu" :key="index" class="py-3 px-6 hover:bg-blue-100 " >
               <NuxtLink :to="item.route">{{item.title}}</NuxtLink>

            </div>
      </MenuItems>
    </transition>
  </Menu>

</template>
