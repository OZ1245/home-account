<template>
  <div class="row justify-center">
    <div class="col-7">
      <q-card class="q-ma-xl">
        <div class="row q-pa-sm-sm q-pa-md">
          <div class="col-12">
            <q-card-section>
              <div class="q-mb-xl">
                <div class="flex justify-center">
                  <div class="text-h4 text-uppercase q-my-none text-weight-bold text-primary fredoka">
                    Update password</div>
                </div>
              </div>

              <q-form
                class="q-gutter-md"
                @submit="submit"
              >
                <q-input
                  v-model="form.password"
                  label="Password"
                  name="Password"
                  :error="error"
                  type="password"
                />

                <q-input
                  v-model="form.passwordRepeat"
                  label="Repeat Password"
                  name="RepeatPassword"
                  :error="error"
                  type="password"
                />

                <div>
                  <q-btn
                    class="full-width fredoka"
                    color="primary"
                    label="Update"
                    rounded
                    type="submit"
                  ></q-btn>

                  <div class="q-mt-lg">
                    <div class="q-mt-sm">
                      <router-link
                        class="text-primary"
                        :to="{ name: 'AccountLogin' }"
                      >Login</router-link>
                      or
                      <router-link
                        class="text-primary"
                        :to="{ name: 'AccountRegistration' }"
                      >Register</router-link>
                    </div>
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { updatePassword } from 'src/supabase/auth';
import { useQuasar } from 'quasar';
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';

const $q = useQuasar()
const router = useRouter()

const form = reactive({
  password: '',
  passwordRepeat: ''
})
const loading = ref<boolean>(false)
const error = ref<boolean>(false)

const submit = () => {
  loading.value = true
  error.value = false

  if (!form.password.length) {
    $q.notify({
      message: 'Введите новый пароль',
      type: 'negative'
    })
    error.value = true

    return
  }

  if (form.password !== form.passwordRepeat) {
    $q.notify({
      message: 'Пароли не совпадают',
      type: 'negative'
    })
    error.value = true

    return
  }

  updatePassword(form.password)
    .then((error) => {
      if (!error) {
        $q.notify({
          message: 'Пароль успешно обновлен.',
          type: 'positive'
        })

        router.push('/')
      }

      loading.value = false
    })
}
</script>
src/supabase/auth
