<template>
  <q-page
    class="finance-plan"
    padding
  >
    <div class="row">
      <div class="col flex justify-center items-center">
        <h1 class="text-h4 text-center finance-plan__heading inline-block">
          {{ displayDate.month }} {{ displayDate.year }}
        </h1>
        <q-btn
          color="primary"
          icon="edit_calendar"
          size="md"
          flat
          @click="handleChangeDate"
        ></q-btn>
      </div>
    </div>

    <ha-budget
      v-bind="budgetProps"
      @save="handleSaveBudget"
    />

    <div class="row">
      <div class="col">
        <ha-calendar
          v-bind="calendarProps"
          @click-day="handelClickDay"
        ></ha-calendar>
      </div>
    </div>
  </q-page>

  <ha-month-picker-dialog
    v-model="showMonthPicker"
    :date="date"
    @apply="handleApplyCurrentDate"
  ></ha-month-picker-dialog>

  <ha-entities-dialog
    v-model="showEntitiesDialog"
    :date="selectedDate"
    :entities="dayEntities"
    @save="handleSaveEntities"
    @remove-all="handleRemoveAllEntites"
    @remove-entity="handleRemoveEntity"
  ></ha-entities-dialog>
</template>

<script
  lang="ts"
  setup
>
import { computed, ref, reactive } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import { useQuasar } from 'quasar';
import { updateEntities, fetchEntityByDate, fetchEntitiesByPeriod, deleteEntities, deleteEntity } from 'src/supabase/entities';
import { fetchBudget } from 'src/supabase/budget'

import HaCalendar from 'src/components/HaCalendar.vue'
import HaMonthPickerDialog from 'src/components/dialogs/HaMonthPickerDialog.vue';
import HaEntitiesDialog from 'src/components/dialogs/HaEntitiesDialog.vue';
import HaBudget from 'src/components/HaBudget.vue';

import { IBudgetProps, ICalendarProps } from 'src/@types/components'
import { IEntity } from 'src/@types/supabase_entity';
import { IBudget, IBudgetData } from 'src/@types/supabase';
import { updateBudget } from 'src/supabase/budget';

const $q = useQuasar()

const date = ref<Dayjs>(dayjs())
const showMonthPicker = ref<boolean>(false)
const showEntitiesDialog = ref<boolean>(false)
const selectedDate = ref<string>('')
const monthEntities = ref<IEntity[] | any>([])
const dayEntities = ref<IEntity[] | any>([])
const initBudgetData: IBudgetData = {
  prepayment: {
    value: '',
    date: ''
  },
  wage: {
    value: '',
    date: ''
  }
}
const budgetProps = reactive<IBudgetProps>({
  uuid: '',
  date: '',
  data: initBudgetData
})

const displayDate = computed(() => ({
  month: date.value.format('MMMM'),
  year: date.value.format('YYYY')
}))
const calendarProps = computed((): ICalendarProps => ({
  date: date.value.toDate(),
  entities: monthEntities.value
}))

const handleChangeDate = () => {
  showMonthPicker.value = true
}
const handleApplyCurrentDate = (e: Date) => {
  date.value = dayjs(e)
  getBudget()
}
const handelClickDay = (date: Date) => {
  const datestring = dayjs(date).format('YYYY-MM-DD')
  selectedDate.value = datestring

  fetchEntityByDate(datestring)
    .then(({ data }) => {
      dayEntities.value = data
      showEntitiesDialog.value = true
    })
}
const handleSaveEntities = (entities: IEntity[]) => {
  updateEntities(entities)
    .then(() => getEntities())
}
const handleRemoveAllEntites = (uuidList: string[]) => {
  deleteEntities(uuidList)
    .then(() => getEntities())
}
const handleRemoveEntity = (uuid: string) => {
  deleteEntity(uuid)
    .then(() => getEntities())
}
const handleSaveBudget = (data: IBudget) => {
  updateBudget(data)
    .then(({ error }) => {
      if (!error) {
        $q.notify({
          message: `Бюджет на ${date.value.format('MMMM')} ${date.value.format('YYYY')} сохранен.`,
          type: 'positive'
        })
      }
    })
}

const getEntities = () => {
  fetchEntitiesByPeriod({
    start: date.value.startOf('month').toISOString(),
    end: date.value.endOf('month').toISOString()
  })
    .then(({ data }) => {
      monthEntities.value = data
    })
}
const getBudget = () => {
  fetchBudget(date.value.format('YYYY MM'))
    .then(({ data }) => {
      if (data.length) {
        budgetProps.uuid = data[0].uuid
        budgetProps.date = data[0].date
        budgetProps.data = data[0].data
      } else {
        budgetProps.uuid = ''
        budgetProps.date = date.value.format('YYYY MM')
        budgetProps.data = initBudgetData
      }
    })
}

const init = () => {
  getEntities()
  getBudget()
}

init()
</script>

<style lang="scss"></style>
