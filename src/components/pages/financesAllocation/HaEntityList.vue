<template>
  <q-list
    bordered
    separator
    v-if="items.length"
  >
    <q-item
      v-for="(item, i) in props.items"
      :key="`list-item-${i}`"
      clickable
    >
      <q-item-section>
        <!-- <pre>{{ item }}</pre> -->
        <span class="text-caption">
          {{ getFormatedDate(item.date as string) }}
        </span>

        <span>
          {{ item.name }}
        </span>
      </q-item-section>

      <q-item-section side>
        <span>
          {{ item.amount }}
        </span>
      </q-item-section>

      <q-item-section side>
        <q-icon
          name="drag_indicator"
          title="Переместить сущность в другую колонку"
        />
      </q-item-section>
    </q-item>
  </q-list>
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
