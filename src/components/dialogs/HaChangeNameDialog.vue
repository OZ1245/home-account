<template>
  <q-dialog
    :model-value="isShow"
    class="change-name"
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <p class="text-h6 q-mb-none">Редактировать имя</p>
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
        <q-form class="row q-pb-md q-col-gutter-md">
          <div class="col">
            <q-input
              v-model="form.firstName"
              label="First name"
            />
          </div>
          <div class="col">
            <q-input
              v-model="form.lastName"
              label="Last Name"
            />
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
import { reactive, computed } from 'vue'
import { IAccountName } from 'src/@types/supabase_account';
import { IChangeNameDialogProps } from 'src/@types/components'

const props = withDefaults(defineProps<IChangeNameDialogProps>(), {
  firstName: '',
  lastName: ''
})

const form = reactive<IAccountName>({
  firstName: props.firstName,
  lastName: props.lastName,
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', value: IAccountName): void
}>()

const isShow = computed((): boolean => props.modelValue)

const handleCancel = () => {
  emits('update:modelValue', false)
}
const handleDone = () => {
  emits('submit', form)
  emits('update:modelValue', false)
}
</script>
