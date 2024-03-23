<template>
  <q-list dense>
    <q-item>
      <q-item-section>Итого затрат:</q-item-section>
      <q-item-section side>{{ props.totalAmount }}</q-item-section>
    </q-item>
    <q-item>
      <q-item-section>Бюджет:</q-item-section>
      <q-item-section side>{{ props.budget }}</q-item-section>
    </q-item>
    <q-item>
      <q-item-section>Остаток:</q-item-section>
      <q-item-section side>{{ balance }}</q-item-section>
    </q-item>
  </q-list>
</template>

<script
  lang="ts"
  setup
>
import { computed } from 'vue'

const props = defineProps<{
  totalAmount: string
  budget: string
}>()

const balance = computed((): string => {
  const balance = parseFloat(props.budget || '0') - parseFloat(props.totalAmount)
  return balance.toFixed(2)
})
</script>
