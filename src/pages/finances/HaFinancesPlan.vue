<template>
  <q-page
    class="finance-plan column q-gutter-md"
    padding
  >
    <div class="row">
      <div class="col flex justify-between">
        <div class="col-1 flex items-center">
          <q-btn
            flat
            icon="chevron_left"
            color="primary"
            @click="handlePreviosMonthClick"
          ></q-btn>
        </div>
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
        <div class="col-1 flex items-center">
          <q-btn
            flat
            icon="chevron_right"
            color="primary"
            @click="handleNextMonthClick"
          ></q-btn>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <ha-budget
          v-bind="budgetProps"
          @save="handleSaveBudget"
        />
      </div>
    </div>

    <div class="row">
      <div class="col flex justify-end">
        <q-btn
          icon="add"
          color="primary"
          label="Quickly adding Entities"
          @click="handleQuickleAddingEntities"
        />
      </div>
    </div>

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
  />

  <ha-entities-dialog
    v-model="showEntitiesDialog"
    :date="selectedDate"
    :entities="dayEntities"
    @save="handleSaveEntities"
    @remove-all="handleRemoveAllEntites"
    @remove-entity="handleRemoveEntity"
    @copy-entity="handleCopyEntity"
  />

  <ha-quickly-adding-entities-dialog
    v-model="showQuickleAddingEntities"
    @save="handleSaveQuicklyEntities"
  />
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
import HaQuicklyAddingEntitiesDialog from 'src/components/dialogs/HaQuicklyAddingEntitiesDialog.vue';

import { IBudgetProps, ICalendarProps } from 'src/@types/components'
import { IEntity, IBudget, IBudgetData } from 'src/@types/supabase';
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
const showQuickleAddingEntities = ref<boolean>(false)

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
  getEntities()
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
const handleCopyEntity = (entity: IEntity) => {
  updateEntities([entity])
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
const handleQuickleAddingEntities = () => {
  showQuickleAddingEntities.value = true
}
const handleSaveQuicklyEntities = (entities: IEntity[]) => {
  updateEntities(entities)
    .then(() => getEntities())
}
const handlePreviosMonthClick = () => {
  date.value = date.value.subtract(1, 'month')
  getEntities()
}
const handleNextMonthClick = () => {
  date.value = date.value.add(1, 'month')
  getEntities()
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
