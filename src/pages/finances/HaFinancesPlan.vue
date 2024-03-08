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
        <ha-calendar v-bind="calendarProps"></ha-calendar>
      </div>
    </div>
  </q-page>

  <ha-month-picker-dialog
    v-model:date="date"
    v-model:show="showMonthPicker"
  ></ha-month-picker-dialog>
</template>

<script
  lang="ts"
  setup
>
import { computed, ref, reactive } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import HaCalendar from 'src/components/HaCalendar.vue'
import HaMonthPickerDialog from 'src/components/dialogs/HaMonthPickerDialog.vue';
import { ICalendarProps } from 'src/@types/components'

const budgetForm = reactive<{
  prepayment: number,
  wage: number
}>({
  prepayment: 0,
  wage: 0
})
const date = ref<Dayjs>(dayjs())
const showMonthPicker = ref<boolean>(false)

const displayDate = computed(() => ({
  month: dayjs(date.value).format('MMMM'),
  year: dayjs(date.value).format('YYYY')
}))
const totalSalary = computed((): number => (
  budgetForm.prepayment + budgetForm.wage
))
const calendarProps = computed((): ICalendarProps => ({
  date: dayjs(date.value).toDate()
}))
// const calendarProps = computed(() => ({
//   showDate: dayjs(date.value).toDate()
// }))

const handleChangeDate = () => {
  showMonthPicker.value = true
}
</script>

<style lang="scss"></style>
