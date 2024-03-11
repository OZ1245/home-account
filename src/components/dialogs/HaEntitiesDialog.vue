<template>
  <q-dialog
    :model-value="isShow"
    @hide="handleHideModal"
  >
    <q-card>
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
            class="row q-pb-md q-col-gutter-md"
          >
            <div class="col-4">
              <q-input
                v-model="entity.name"
                label="Название предмета"
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="entity.amount"
                label="Сумма"
                mask="#.##"
                fill-mask="0"
                reverse-fill-mask
              />
            </div>
            <div class="col-4">
              <q-input
                v-model="entity.note"
                label="Примечание"
              />
            </div>
          </div>

          <div class="row">
            <div class="col flex justify-end">
              <q-btn
                icon="add"
                color="primary"
                @click="handleAddEntity"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="between">
        <q-btn
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
import dayjs from 'dayjs';
import { IAddEntity, IEntity, IUpdateEntity } from 'src/@types/supabase_entity';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean,
  date: string,
  entities?: IEntity[]
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: IEntity[]): void
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

const isShow = computed((): boolean => props.modelValue)
const formatedDate = computed((): string => (
  (props.date) ? dayjs(props.date).format('DD MMM YYYY') : ''
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
</script>
