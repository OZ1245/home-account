<template>
  <q-dialog :model-value="isShow">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <p class="text-h6 q-mb-none">Изменить пароль</p>
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
              v-model="form.oldPassword"
              label="Старый пароль"
              type="password"
              :error="errors.oldPassword"
            />
            <q-input
              v-model="form.newPassword"
              label="Новый пароль"
              type="password"
              :error="errors.newPassword"
            />
            <q-input
              v-model="form.newPasswordRepeat"
              label="Повторите новый пароль"
              type="password"
              :error="errors.newPassword"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="between">
        <q-btn
          color="secondary"
          label="Cancel"
          v-close-popup
          :loading="loading"
          @click="handleCancel"
        />
        <q-btn
          color="primary"
          label="Submit"
          :disable="!isValid"
          :loading="loading"
          @click="handleSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script
  lang="ts"
  setup
>
import { useQuasar } from 'quasar';
import { IAccountPasswords } from 'src/@types/supabase_account';
import { updatePassword, verifyPassword } from 'src/supabase/auth';
import { ref, computed, defineEmits, reactive } from 'vue'

const $q = useQuasar()

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const form = reactive<IAccountPasswords>({
  oldPassword: '',
  newPassword: '',
  newPasswordRepeat: '',
})
const errors = reactive<{
  oldPassword?: boolean,
  newPassword?: boolean
}>({
  oldPassword: false,
  newPassword: false,
})
const loading = ref<boolean>(false)

const isShow = computed((): boolean => props.modelValue)
const isValid = computed((): boolean => {
  if (!form.oldPassword.length) {
    return false
  }

  if (!form.newPassword.length) {
    return false
  }

  if (!form.newPasswordRepeat.length) {
    return false
  }

  return true
})

const handleCancel = () => {
  emits('update:modelValue', false)
}
const handleSubmit = () => {
  console.log('--- handleSubmit ---');
  resetErrors()
  loading.value = true

  verifyPassword(form.oldPassword)
    .then((error) => {
      if (!error) {
        errors.oldPassword = true

        $q.notify({
          message: 'Неверный текущий пароль',
          type: 'negative'
        })

        loading.value = false

        return
      }

      if (form.newPassword !== form.newPasswordRepeat) {
        errors.newPassword = true

        $q.notify({
          message: 'Пароли не совпадают',
          type: 'negative'
        })

        loading.value = false

        return
      }

      loading.value = true

      updatePassword(form.newPassword)
        .then((error) => {
          if (!error) {
            $q.notify({
              message: 'Пароль успешно обновлен',
              type: 'positive'
            })

            // loading.value = false
            emits('update:modelValue', false)
          }
        })
    })
}

const resetErrors = () => {
  errors.oldPassword = false
  errors.newPassword = false
}
</script>
