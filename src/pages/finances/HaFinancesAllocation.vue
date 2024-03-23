<template>
  <q-page
    class="finance-allocation"
    padding
  >
    <div class="row">
      <div class="col">
        <h1 class="text-h4 text-center">
          Распределить сущности
          <strong>{{ formattedDate }}</strong>
        </h1>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-6">
        <p class="text-h6 text-center">
          Первая половина месяца
          <span>(до {{ formattedBudgetPeriod }})</span>
        </p>
        <ha-entity-list :items="listLeft" />
      </div>
      <div class="col-6">
        <p class="text-h6 text-center">
          Вторая половина месяца
          <span>(после {{ formattedBudgetPeriod }})</span>
        </p>
        <ha-entity-list :items="listRight" />
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-6">
        <ha-resume
          :total-amount="getTotalAmount(listLeft)"
          :budget="budget?.data.prepayment.value || '0'"
        />
      </div>
      <div class="col-6">
        <ha-resume
          :total-amount="getTotalAmount(listRight)"
          :budget="budget?.data.wage.value || '0'"
        />
      </div>
    </div>
  </q-page>
</template>

<script
  lang="ts"
  setup
>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useFinanceStore } from 'src/stores/entities';

import dayjs, { Dayjs } from 'dayjs';

import HaEntityList from 'src/components/pages/financesAllocation/HaEntityList.vue'
import HaResume from 'src/components/pages/financesAllocation/HaResume.vue'

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
const formattedDate = computed((): string => (
  date.value.format('MMMM YYYY')
))
const formattedBudgetPeriod = computed((): string => (
  (budget.value?.data.wage.date)
    ? dayjs(budget.value.data.wage.date, 'YYYY-MM-DD').format('D').toString()
    : ''
))

const getTotalAmount = (list: IEntity[]): string => (
  list.reduce((accumulator: number, currentItem: IEntity): number => (
    (currentItem)
      ? parseFloat(accumulator) + parseFloat(currentItem.amount || '0')
      : accumulator
  ), 0).toFixed(2)
)

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

  const allocatedEntities = entities.value
    .filter((entity) => {
      const entityDate = dayjs(entity.date, 'YYYY-MM-DD')
      // console.log('entityDate:', entityDate);
      return (entityDate >= dateStart && entityDate < dateEnd)
    })
    .sort((a, b) => {
      const aDate = dayjs(a.date, 'YYYY-MM-DD')
      const bDate = dayjs(b.date, 'YYYY-MM-DD')
      return aDate.isAfter(bDate) ? 1 : -1
    })

  return allocatedEntities
}

init()
</script>
