<template>
  <router-view />

  <q-drawer
    v-model="drawer"
    show-if-above
    side="right"
    :mini="!drawer || miniState"
    mini-to-overlay
    :width="200"
    :breakpoint="500"
    bordered
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
  >
    <q-scroll-area class="fit">
      <q-list padding>
        <q-item
          clickable
          v-ripple
          @click="handleDrawerToggler"
        >
          <q-item-section avatar>
            <q-icon :name="togglerDrawerIcon" />
          </q-item-section>
          <q-item-section>
            Свернуть
          </q-item-section>
        </q-item>

        <q-item
          v-ripple
          clickable
          :to="{ name: 'FinancesPlan' }"
          title="Планирование"
        >
          <q-item-section avatar>
            <q-icon name="calendar_month" />
          </q-item-section>

          <q-item-section>
            Планирование
          </q-item-section>
        </q-item>

        <q-item
          v-ripple
          clickable
          title="Распределение"
          @click="handleAllocationClick"
        >
          <q-item-section avatar>
            <q-icon name="swap_horiz" />
          </q-item-section>

          <q-item-section>
            Распределение
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
import { useRoute, useRouter } from 'vue-router';

const $route = useRoute()
const $router = useRouter()

const miniState = ref<boolean>(true)
const drawer = ref<boolean>(true)

const togglerDrawerIcon = computed((): string => (
  (miniState.value) ? 'chevron_left' : 'chevron_right'
))

const handleAllocationClick = () => {
  $router.push({
    name: 'FinancesAllocation',
    params: {
      date: $route.query?.date as string || null
    }
  })
}

const handleDrawerToggler = () => {
  miniState.value = !miniState.value
}
</script>

<style lang="scss">
.finances-layout {
  flex-grow: 1;
}
</style>
