<template>
  <q-dialog
    :model-value="isShow"
    @hide="handleHideModal"
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <p class="text-h6 q-mb-none">Выбрать год или месяц</p>
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
          :model-value="date"
          ref="calendarElement"
          default-view="Months"
          years-in-month-view
          emit-immediately
          minimal
          @update:model-value="handleSelectDate"
        ></q-date>
      </q-card-section>

      <q-card-actions align="between">
        <q-btn
          label="Reset"
          v-close-popup
          @click="handleReset"
        />
        <q-btn
          color="primary"
          label="Apply"
          v-close-popup
          @click="handleApply"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script
  lang="ts"
  setup
>
import { ref, watch, defineModel, computed, onMounted } from 'vue'
import dayjs, { Dayjs } from 'dayjs';

const props = defineProps<{
  modelValue: boolean
  date: Dayjs
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'apply', value: Date): void
}>()

const calendarElement = ref<HTMLElement | null>(null)
const selectedDate = ref<Date | null>(null)

const isShow = computed((): boolean => props.modelValue)
const date = computed((): Date => selectedDate.value || new Date())

const handleSelectDate = (value: Date) => {
  calendarElement.value?.setView('Months')

  selectedDate.value = value
}
const handleReset = () => {
  calendarElement.value?.setToday()
  selectedDate.value = new Date()
  emits('apply', selectedDate.value)
  emits('update:modelValue', false)
}
const handleApply = () => {
  emits('apply', selectedDate.value)
  emits('update:modelValue', false)
}
const handleHideModal = () => {
  emits('update:modelValue', false)
}

const init = () => {
  selectedDate.value = dayjs(props.date).toDate() || new Date()
}

init()
</script>
