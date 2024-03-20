<template>
  <q-item
    clickable
    :to="route"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script
  setup
  lang="ts"
>
import { VueClassObjectProp } from 'quasar';
import { computed } from 'vue';
import { RouteLocationRaw } from 'vue-router';

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  route?: RouteLocationRaw | null;
  icon?: string;
}
withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  route: null,
  align: ''
});
</script>
