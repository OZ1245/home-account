<template>
  <q-dialog
    :model-value="isShow"
    class="quickly-entities-dialog"
  >
    <q-card style="width: 100%; max-width: 1200px;">
      <q-card-section>
        <p class="text-h6 q-mb-none">Быстрое добавление сущностей</p>
      </q-card-section>

      <q-card-section>
        <q-form>
          <div
            v-for="(entity, i) in entities"
            :key="`entity-form-${i}`"
            class="row q-col-gutter-md"
          >
            <div class="col-6 col-md-2">
              <ha-datepicker
                v-model="entity.date"
                label="Дата"
              />
            </div>

            <div class="col-6 col-md-3">
              <q-input
                v-model="entity.name"
                label="Название предмета"
              />
            </div>

            <div class="col-6 col-md-3">
              <q-input
                v-model="entity.amount"
                label="Сумма"
                mask="#.##"
                fill-mask="0"
                reverse-fill-mask
              />
            </div>

            <div class="col-6 col-md-3">
              <q-input
                v-model="entity.note"
                label="Примечание"
              />
            </div>

            <div class="col-12 col-md-1 flex items-center justify-end justify-md-center">
              <q-btn
                flat
                icon="delete"
                color="negative"
                @click="handleRemoveEntity(i)"
              />
            </div>
          </div>

          <div class="row">
            <div class="col flex justify-end">
              <q-btn
                color="negative"
                icon="delete"
                label="Remove all"
                @click="handleRemoveAll"
              />
              <q-btn
                color="primary"
                icon="add"
                label="Add"
                class="q-ml-md"
                @click="handleAddEntity"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="between">
        <q-btn
          color="secondary"
          label="Cancel"
          v-close-popup
          @click="handleCancel"
        />
        <q-btn
          color="primary"
          label="Done"
          v-close-popup
          @click="handleDone"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script
  lang="ts"
  setup
>
import { reactive, toRef, ref } from 'vue';
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import HaDatepicker from 'src/components/common/HaDatepicker.vue';

import { IEntity } from 'src/@types/supabase';

dayjs.extend(customParseFormat)

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: IEntity[]): void
}>()

const isShow = toRef(props, 'modelValue')
const initForm = reactive<IEntity>({
  date: '',
  name: '',
  amount: '',
  note: ''
})
const entities = ref<IEntity[]>([])

const handleAddEntity = () => {
  entities.value.push({ ...initForm })
}
const handleCancel = () => {
  emits('update:modelValue', false)
}
const handleRemoveEntity = (index: number) => {
  entities.value.splice(index, 1)
}
const handleRemoveAll = () => {
  entities.value = []
}
const handleDone = () => {
  const data = entities.value.map((entity) => ({
    ...entity,
    date: dayjs(entity.date, 'DD.MM.YYYY').format('YYYY-MM-DD')
  }))

  emits('save', data)

  entities.value = []

  emits('update:modelValue', false)
}
</script>
