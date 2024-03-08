<template>
  <router-view />

  <q-drawer
    v-model="drawer"
    show-if-above
    side="right"
    :mini="!drawer || miniState"
    :width="200"
    :breakpoint="500"
    bordered
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    @click.capture="handleDrawerToggler"
  >
    <q-scroll-area class="fit">
      <q-list padding>
        <q-item
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon :name="togglerDrawerIcon" />
          </q-item-section>
          <q-item-section>
            Свернуть
          </q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section avatar>
            <q-icon name="inbox" />
          </q-item-section>

          <q-item-section>
            Inbox
          </q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section avatar>
            <q-icon name="star" />
          </q-item-section>

          <q-item-section>
            Star
          </q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section avatar>
            <q-icon name="send" />
          </q-item-section>

          <q-item-section>
            Send
          </q-item-section>
        </q-item>

        <q-item v-ripple>
          <q-item-section avatar>
            <q-icon name="drafts" />
          </q-item-section>

          <q-item-section>
            Drafts
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script
  setup
  lang="ts"
>
import { computed, ref } from 'vue';
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
const miniState = ref<boolean>(true)
const drawer = ref<boolean>(true)

const togglerDrawerIcon = computed((): string => (
  (miniState.value) ? 'chevron_left' : 'chevron_right'
))

function handleDrawerToggler() {
  miniState.value = !miniState.value
}
</script>

<style lang="scss">
.finances-layout {
  flex-grow: 1;
}
</style>
