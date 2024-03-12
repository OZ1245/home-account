<template>
  <q-dialog
    :model-value="isShow"
    class="entities-dialog"
    @hide="handleHideModal"
  >
    <q-card style="width: 100%; max-width: 800px">
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
            class="row q-pb-md q-col-gutter-md items-end justify-between"
          >
            <q-input
              v-model="entity.name"
              class="entities-dialog__field"
              label="Название предмета"
            />
            <q-input
              v-model="entity.amount"
              label="Сумма"
              mask="#.##"
              fill-mask="0"
              reverse-fill-mask
              class="entities-dialog__field"
            />
            <q-input
              v-model="entity.note"
              label="Примечание"
              class="entities-dialog__field"
            />

            <div class="entities-dialog__remove-button">
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
</template>

<script
  lang="ts"
  setup
>
import dayjs from 'dayjs';
import { IEntity } from 'src/@types/supabase_entity';
import { computed, reactive, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean,
  date: string,
  entities?: IEntity[]
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: IEntity[]): void
  (e: 'removeAll', value: string[]): void
  (e: 'removeEntity', value: string): void
}>()

const initForm = reactive<{
  date: string
  name: string
  amount: string | null
  note: string
}>({
  date: '',
  name: '',
  amount: null,
  note: ''
})
const entities = ref<IEntity[]>([])
const showRemoveAllDialog = ref<boolean>(false)
const showRemoveEntityDialog = ref<boolean>(false)
const deleteEntityIndex = ref<number | null>(null)

const isShow = computed((): boolean => props.modelValue)
const formatedDate = computed((): string => (
  (props.date) ? dayjs(props.date).format('DD MMM YYYY') : ''
))
const deleteEntityName = computed((): string => (
  (deleteEntityIndex.value)
    ? entities.value[deleteEntityIndex.value].name || ''
    : ''
))

watch(
  () => props.modelValue,
  () => {
    initForm.date = (props.date)
      ? props.date
      : dayjs(new Date()).format('YYYY-MM-DD')

    entities.value = props.entities || []
  }
)

const handleHideModal = () => {
  emits('update:modelValue', false)
}
const handleCancel = () => {
  emits('update:modelValue', false)
}
const handleDone = () => {
  emits('save', entities.value)
  entities.value = []
  emits('update:modelValue', false)
}
const handleAddEntity = () => {
  entities.value.push({
    date: initForm.date,
    name: initForm.name,
    amount: initForm.amount,
    note: initForm.note,
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
const handleConfirmRemoveEntity = () => {
  if (deleteEntityIndex.value === null) return

  const uuid = entities.value[deleteEntityIndex.value].uuid

  if (uuid) {
    emits('removeEntity', uuid)
  }

  entities.value.splice(deleteEntityIndex.value, 1)
  deleteEntityIndex.value = null
}
</script>

<style lang="scss"></style>
