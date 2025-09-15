<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {logOut, getUser } from "~/utils/Authentication";


const UIStore = useGlobalUIStore();
const user  = ref(null);

onMounted( async () => {
   UIStore.hideLoading()
   user.value = await getUser();
})

const onLogOut = () => {
  UIStore.showLoading()
  logOut()
}


</script>
<template>
  <mtm-loading-background/>
  <Menu as="div" class="relative inline-block text-left w-full">
    <div>
      <MenuButton class="">
        <div class=" w-full rounded-2xl flex items-center gap-2 px-4 lg:px-0 py-3 ">
          <div class="flex flex-col gap-3">
            <v-icon size="x-large" class="hidden lg:block mx-auto">mdi-dots-horizontal</v-icon>
            <div class="h-12 w-12 rounded-full bg-gray-300"></div>

            <img v-if="false" class="h-16 w-16 rounded-full object-cover border-2 border-gray-400"
              src="https://www.shutterstock.com/image-photo/healthcare-medical-staff-concept-portrait-600nw-2281024823.jpg" />
          </div>
          <div class="flex gap-2 lg:hidden">
            <div class="flex-col mr-auto overflow-hidden leading-3">
              <span class="font-bold text-ellipsis text-sm text-left">{{ user?.given_name }} {{ user?.family_name }}</span>
              <span class="font-ligth text-ellipsis text-xs text-left">{{ user?.email }}</span>
            </div>
            <div class="">
              <v-icon>mdi-dots-vertical</v-icon>
            </div>
          </div>
        </div>
      </MenuButton>
    </div>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems
        class="absolute bottom-0 -right-80 z-10 m-5 w-80 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div class="py-2 px-2 flex flex-col gap-1">
          <div class="w-full flex items-center gap-2 px-4 py-3 ">
            <div>
              <div class="h-12 w-12 rounded-full bg-gray-300"></div>
              <img v-if="false" class="h-12 w-12 rounded-full object-cover"
                src="https://www.shutterstock.com/image-photo/healthcare-medical-staff-concept-portrait-600nw-2281024823.jpg" />
            </div>
            <div class="flex flex-col mr-auto overflow-hidden leading-3">
              <span class="font-bold text-ellipsis text-sm text-left">{{ user?.given_name }} {{ user?.family_name }}</span>
              <span class="font-ligth text-ellipsis text-xs text-left">{{ user?.email }}</span>
            </div>
          </div>
          <a href="/account-setting" class="flex gap-2 items-center hover:bg-gray-100 py-3 px-3 rounded-lg">
            <div><v-icon>mdi-account-circle-outline</v-icon></div>
            <span>Configuracion de Cuenta</span>
          </a>
          <div class="w-full border-t border-gray-400"></div>
          <button @click="onLogOut()" class="flex gap-2 items-center hover:bg-gray-100 py-3 px-3 rounded-lg">
            <div><v-icon>mdi-logout</v-icon></div>
            <span>Cerrar Sesion</span>
          </button>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

