<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Home Accounting
        </q-toolbar-title>

        <div>Ver. 0.0.1, Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :mini="!leftDrawerOpen || miniState"
      show-if-above
      bordered
      :width="250"
    >
      <q-list>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script
  setup
  lang="ts"
>
import { ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';

const essentialLinks = [
  {
    title: 'Финансовый план',
    caption: '',
    icon: 'menu_book',
    link: '/finances/plan'
  },
  {
    title: 'Account',
    caption: '',
    icon: 'account_circle',
    link: '/account'
  }
];
const miniState = ref<boolean>(false)
const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  miniState.value = !miniState.value
}
</script>
