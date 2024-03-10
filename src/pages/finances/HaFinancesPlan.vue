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

    <div class="row">
      <div class="col">
        <q-list bordered>
          <q-expansion-item
            expand-separator
            label="Бюджет"
          >
            <q-card>
              <q-card-section>
                <q-form>
                  <div class="row ">
                    <div class="col-5 col-md-4">
                      <q-input
                        v-model.number="budgetForm.prepayment"
                        label="Аванс"
                      />
                      <q-input
                        v-model.number="budgetForm.wage"
                        label="Заработная палата"
                      />
                    </div>
                    <div class="col-5 offset-1 col-md-4 flex items-center">
                      <q-input
                        v-model="totalSalary"
                        label="Итого (оклад)"
                        readonly
                      />
                    </div>
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
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
  ></ha-month-picker-dialog>

  <ha-entities-dialog
    v-model="showEntitiesDialog"
    :date="selectedDate"
    :entities="dayEntities"
    @update-entities="handleUpdateEntities"
    @add-entities="handleAddEntities"
  ></ha-entities-dialog>
</template>

<script
  lang="ts"
  setup
>
import { computed, ref, reactive } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import HaCalendar from 'src/components/HaCalendar.vue'
import HaMonthPickerDialog from 'src/components/dialogs/HaMonthPickerDialog.vue';
import HaEntitiesDialog from 'src/components/dialogs/HaEntitiesDialog.vue';
import { ICalendarProps } from 'src/@types/components'
import { IAddEntity, IEntity } from 'src/@types/supabase_entity';
import { addEntity, fetchEntityByDate, fetchEntitiesByPeriod } from 'src/supabase/entities';

const budgetForm = reactive<{
  prepayment: number,
  wage: number
}>({
  prepayment: 0,
  wage: 0
})
const date = ref<Dayjs>(dayjs())
const showMonthPicker = ref<boolean>(false)
const showEntitiesDialog = ref<boolean>(false)
const selectedDate = ref<Date | null>(null)
const monthEntities = ref<IEntity[] | any>([])
const dayEntities = ref<IEntity[] | any>([])

const displayDate = computed(() => ({
  month: date.value.format('MMMM'),
  year: date.value.format('YYYY')
}))
const totalSalary = computed((): number => (
  budgetForm.prepayment + budgetForm.wage
))
const calendarProps = computed((): ICalendarProps => ({
  date: date.value.toDate(),
  entities: monthEntities.value
}))

const handleChangeDate = () => {
  showMonthPicker.value = true
}
const handleApplyCurrentDate = (e: Date) => {
  date.value = dayjs(e)
}
const handelClickDay = (date: Date) => {
  showEntitiesDialog.value = true
  selectedDate.value = date

  fetchEntityByDate(dayjs(date).format('YYYY-MM-DD'))
    .then(({ data }) => {
      dayEntities.value = data
    })
}
const handleAddEntities = (entities: IAddEntity[]) => {
  console.log('--- handleAddEntities ---');
  console.log('entities:', entities);

  Promise.all(entities.map((item) => {
    console.log('item:', item);
    addEntity(item)
      .then((result) => {
        console.log('result:', result);
      })
  }))
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

getEntities()
</script>

<style lang="scss"></style>
