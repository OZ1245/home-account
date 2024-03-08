<template>
  <q-dialog v-model="show">
    <q-card>
      <q-card-section>
        <h6>Выбрать год или месяц</h6>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>

      <q-card-section>
        <q-date
          v-model="date"
          ref="calendarElement"
          default-view="Months"
          years-in-month-view
          emit-immediately
          minimal
          @update:model-value="handleSelectDate"
        ></q-date>
      </q-card-section>

      <q-card-actions
        align="center"
        class="text-primary"
      >
        <q-btn
          color="primary"
          label="Reset"
          v-close-popup
          @click="handleReset"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script
  lang="ts"
  setup
>
import { ref, watch, defineModel } from 'vue'
import dayjs, { Dayjs } from 'dayjs';

const props = defineProps<{
  date: Dayjs | null,
  show: boolean
}>()
const date = defineModel('date')
const show = defineModel('show')

const emits = defineEmits<{
  (e: 'update:date', value: Dayjs): void
  (e: 'update:show', value: boolean): void
}>()

const calendarElement = ref<HTMLElement | null>(null)
const showModal = ref<boolean>(false)
const selectedDate = ref<Dayjs | null>(null)

watch(
  () => props.show,
  (val) => {
    showModal.value = val
  }
)

const handleSelectDate = (value, reason, details) => {
  console.log('--- handleSelectDate ---');
  console.log('value:', value);
  console.log('reason:', reason);
  console.log('details:', details);

  calendarElement.value?.setView('Months')

  selectedDate.value = value
}
const handleReset = () => {
  calendarElement.value?.setToday()
}
</script>
