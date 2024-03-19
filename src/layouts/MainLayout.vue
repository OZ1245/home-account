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
      class="flex column justify-between"
    >
      <q-list>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>

      <q-list>
        <q-item
          clickable
          tag="a"
          href="Account"
        >
          <q-item-section avatar>
            <q-avatar v-if="avatar">
              <img
                :src="avatar"
                style="object-fit: cover;"
              />
            </q-avatar>
            <q-icon
              v-else
              name="account_circle"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>Account</q-item-label>
          </q-item-section>
        </q-item>
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
import { useAccount } from 'src/composables/account';

import EssentialLink from 'components/EssentialLink.vue';

const { getAvatar } = useAccount()

const essentialLinks = [
  {
    title: 'Финансовый план',
    caption: '',
    icon: 'menu_book',
    link: '/finances/plan'
  },
];
const miniState = ref<boolean>(false)
const leftDrawerOpen = ref(false)
const avatar = ref<string>('')

function toggleLeftDrawer() {
  miniState.value = !miniState.value
}

getAvatar().then((result) => {
  avatar.value = result
})
</script>
