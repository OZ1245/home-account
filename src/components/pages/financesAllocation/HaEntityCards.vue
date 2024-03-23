<template>
  <q-item
    v-for="(item, i) in props.items"
    :key="`list-item-${i}`"
  >
    <q-item-section>
      <!-- <pre>{{ item }}</pre> -->
      {{ getFormatedDate(item.date as string) }}
      -
      {{ item.name }}
      -
      {{ item.amount }}
    </q-item-section>
  </q-item>
</template>

<script
  lang="ts"
  setup
>
import dayjs from 'dayjs';
import { IEntity } from 'src/@types/supabase'

const props = defineProps<{
  items: IEntity[]
}>()

const getFormatedDate = (date: string) => (
  dayjs(date, 'YYYY-MM-DD').format('DD.MM')
)
</script>
