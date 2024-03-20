<template>
  <q-page
    class="finance-allocation"
    padding
  >
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-center">Распределить сущности</h1>
      </div>
    </div>

    <div class="row">
      <div class="col-6">
        <q-list v-if="listLeft.length">
          <q-item
            v-for="(item, i) in listLeft"
            :key="`list-left-${i}`"
          >
            <q-item-section>
              <!-- <pre>{{ item }}</pre> -->
              {{ dayjs(item.date, 'YYYY-MM-DD').format('DD.M') }}
              -
              {{ item.name }}
              -
              {{ item.amount }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-6">
        <q-list v-if="listRight.length">
          <q-item
            v-for="(item, i) in listRight"
            :key="`list-right-${i}`"
          >
            <q-item-section>
              <!-- <pre>{{ item }}</pre> -->
              {{ dayjs(item.date, 'YYYY-MM-DD').format('DD.M') }}
              -
              {{ item.name }}
              -
              {{ item.amount }}
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script
  lang="ts"
  setup
>
import { computed, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { useFinanceStore } from 'src/stores/entities';

import dayjs, { Dayjs } from 'dayjs';

import { IEntity, IBudget } from 'src/@types/supabase';
import { fetchBudget } from 'src/supabase/budget';
import { fetchEntitiesByPeriod } from 'src/supabase/entities';

const $store = useFinanceStore()
const $route = useRoute()

const budget = ref<IBudget | null>(null)
const entities = ref<IEntity[]>([])
const listLeft = ref<IEntity[]>([])
const listRight = ref<IEntity[]>([])

const date = computed((): Dayjs => (
  $route.params?.date
    ? dayjs($route.params?.date as string, 'YYYY MM')
    : dayjs()
))

const init = () => {
  const budgetPromise = fetchBudget(date.value.format('YYYY MM'))
    .then((result) => result.data)

  const entitiesPromise = fetchEntitiesByPeriod({
    start: date.value.startOf('month').toISOString(),
    end: date.value.endOf('month').toISOString(),
  })
    .then((result) => result.data)

  Promise.all([budgetPromise, entitiesPromise])
    .then((responses) => {
      budget.value = responses[0][0]
      entities.value = responses[1]

      listLeft.value = allocate('p')
      listRight.value = allocate('w')
    })
}
/**
 * @param {string} option p - prepayment, w - wage
 * @returns {IEntity[]} Массив сущностей
 */
const allocate = (option: string = 'p'): IEntity[] => {
  if (!budget.value?.data.prepayment.date || !budget.value?.data.wage.date) return []

  let dateStart: Dayjs
  let dateEnd: Dayjs

  if (option === 'p') {
    // Prepaymment
    dateStart = dayjs(budget.value.data.prepayment.date, 'DD.MM.YYYY')
    dateEnd = dayjs(budget.value.data.wage.date, 'DD.MM.YYYY')
  } else if (option === 'w') {
    // Wage
    dateStart = dayjs(budget.value.data.wage.date, 'DD.MM.YYYY')
    dateEnd = dayjs(budget.value.data.prepayment.date, 'DD.MM.YYYY').add(1, 'M')
  } else {
    console.log('no option');
    return []
  }

  const allocatedEntities = entities.value.filter((entity) => {
    const entityDate = dayjs(entity.date, 'YYYY-MM-DD')
    // console.log('entityDate:', entityDate);
    return (entityDate >= dateStart && entityDate < dateEnd)
  })

  return allocatedEntities
}

init()
</script>
