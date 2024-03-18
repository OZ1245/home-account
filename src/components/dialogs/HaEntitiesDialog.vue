<template>
  <q-dialog
    :model-value="isShow"
    class="entities-dialog"
    @hide="handleHideModal"
  >
    <q-card style="width: 100%; max-width: 820px">
      <q-card-section class="row items-center q-pb-none">
        <p class="text-h6 q-mb-none">Добавить платежи на {{ formatedDate }}</p>
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
        <q-form>
          <div
            v-for="(entity, i) in entities"
            :key="`entity-form-${i}`"
            class="row q-col-gutter-md"
          >
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

            <div class="col-12 col-md-3 flex items-center justify-end justify-md-center">
              <q-btn
                flat
                icon="delete"
                color="negative"
                @click="handleRemoveEntity(i)"
              />
              <q-btn-dropdown
                flat
                icon="content_copy"
                color="primary"
              >
                <q-list>
                  <q-item
                    clickable
                    v-close-popup
                    @click="handleCopyEntityToCurrentDay(i)"
                  >
                    <q-item-section>
                      <q-item-label>В текущий день</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="handleCopyEntityToOtherDay(i)"
                  >
                    <q-item-section>
                      <q-item-label>В другой</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
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

  <q-dialog
    v-model="showRemoveAllDialog"
    persistent
  >
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar
          icon="delete"
          color="negative"
          text-color="white"
        />
        <span class="q-ml-sm">
          Вы уверены, что хотите удалить все сущности на данный день?
          <br>
          После данного действия восстановить их не будет возможным.
        </span>
      </q-card-section>

      <q-card-actions align="between">
        <q-btn
          flat
          label="Cancel"
          color="primary"
          v-close-popup
        />
        <q-btn
          flat
          label="Confirm"
          color="negative"
          v-close-popup
          @click="handleConfirmRemoveAll"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showRemoveEntityDialog"
    persistent
  >
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar
          icon="delete"
          color="negative"
          text-color="white"
        />
        <span class="q-ml-sm">
          Вы уверены, что хотите удалить сущность {{ deleteEntityName }}?
          <br>
          После данного действия восстановить ее не будет возможным.
        </span>
      </q-card-section>

      <q-card-actions align="between">
        <q-btn
          flat
          label="Cancel"
          color="primary"
          v-close-popup
        />
        <q-btn
          flat
          label="Confirm"
          color="negative"
          v-close-popup
          @click="handleConfirmRemoveEntity"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showCopyDatepicker">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <p class="text-h6 q-mb-none">Копировать сущность</p>
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
          v-model="copiedEntityDate"
          mask="DD.MM.YYYY"
          @update:model-value="handleSelectCopiedEntityDate"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script
  lang="ts"
  setup
>
import { computed, reactive, ref, watch, toRef } from 'vue';
import dayjs from 'dayjs';

import { IEntity } from 'src/@types/supabase';

const props = withDefaults(defineProps<{
  modelValue: boolean,
  date?: string,
  entities?: IEntity[]
}>(), {
  date: dayjs(new Date()).format('YYYY-MM-DD'),
  entities: () => []
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: IEntity[]): void
  (e: 'removeAll', value: string[]): void
  (e: 'removeEntity', value: string): void
  (e: 'copyEntity', value: IEntity): void
}>()

const initForm = reactive<{
  name: string
  amount: string | null
  note: string
}>({
  name: '',
  amount: null,
  note: ''
})

const entities = toRef(props, 'entities')
const isShow = toRef(props, 'modelValue')

const showRemoveAllDialog = ref<boolean>(false)
const showRemoveEntityDialog = ref<boolean>(false)
const deleteEntityIndex = ref<number | null>(null)
const showCopyDatepicker = ref<boolean>(false)
const copiedEntity = ref<IEntity | null>(null)
const copiedEntityDate = ref<string>('')

// const isShow = computed((): boolean => props.modelValue)
const formatedDate = computed((): string => (
  (props.date) ? dayjs(props.date).format('DD MMM YYYY') : ''
))
const deleteEntityName = computed((): string => (
  (deleteEntityIndex.value)
    ? entities.value[deleteEntityIndex.value].name || ''
    : ''
))

const handleHideModal = () => {
  emits('update:modelValue', false)
}
const handleCancel = () => {
  emits('update:modelValue', false)
}
const handleDone = () => {
  emits('save', entities.value)
  emits('update:modelValue', false)
}
const handleAddEntity = () => {
  entities.value.push({
    ...initForm,
    date: props.date,
  })
}
const handleRemoveAll = () => {
  showRemoveAllDialog.value = true
}
const handleConfirmRemoveAll = () => {
  let uuidList: string[] = []

  entities.value.map((entity) => {
    if (entity.uuid) {
      uuidList = [
        ...uuidList,
        entity.uuid
      ]
    }
  })

  emits('removeAll', uuidList)

  entities.value = []
}
const handleRemoveEntity = (index: number) => {
  showRemoveEntityDialog.value = true
  deleteEntityIndex.value = index
}
const handleCopyEntityToCurrentDay = (index: number) => {
  const entity = {
    date: entities.value[index].date,
    name: entities.value[index].name,
    amount: entities.value[index].amount,
    note: entities.value[index].note
  }

  entities.value.splice(index, 0, entity)
}
const handleCopyEntityToOtherDay = (index: number) => {
  copiedEntity.value = {
    name: entities.value[index].name,
    amount: entities.value[index].amount,
    note: entities.value[index].note
  }

  showCopyDatepicker.value = true
}
const handleConfirmRemoveEntity = () => {
  if (deleteEntityIndex.value === null) return

  const uuid = entities.value[deleteEntityIndex.value].uuid

  if (uuid) {
    emits('removeEntity', uuid)
  }

  entities.value.splice(deleteEntityIndex.value, 1)
  deleteEntityIndex.value = null
}
const handleSelectCopiedEntityDate = () => {
  showCopyDatepicker.value = false

  if (!copiedEntity.value) return

  emits('copyEntity', {
    ...copiedEntity.value,
    date: dayjs(copiedEntityDate.value, 'DD.MM.YYYY').format('YYYY-MM-DD')
  })

  copiedEntity.value = null
}
</script>

<style lang="scss"></style>
