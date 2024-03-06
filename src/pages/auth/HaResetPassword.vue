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
                    Reset password</div>
                </div>
              </div>

              <q-form
                class="q-gutter-md"
                @submit="submit"
              >
                <q-input
                  v-model="email"
                  label="Email"
                  name="Email"
                />

                <div>
                  <q-btn
                    class="full-width fredoka"
                    color="primary"
                    label="Reset"
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
import { resetPassword } from 'app/supabase/auth';
import { useQuasar } from 'quasar';
import { ref } from 'vue'

const $q = useQuasar()

const email = ref<string>('')
const loading = ref<boolean>(false)

const submit = () => {
  loading.value = true

  resetPassword(email.value)
    .then((error) => {
      if (!error) {
        $q.notify({
          message: 'На указанную вами почту направлено письмо ссылкой для сброса пароля.',
          type: 'positive'
        })
      }

      loading.value = false
    })
}
</script>
