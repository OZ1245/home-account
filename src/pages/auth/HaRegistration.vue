<!-- src/pages/RegisterPage.vue -->

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
                    Registration</div>
                </div>
              </div>

              <q-form
                class="q-gutter-md"
                @submit="submit"
              >
                <q-input
                  v-model="form.firstName"
                  label="First Name"
                  name="First Name"
                />
                <q-input
                  v-model="form.lastName"
                  label="Last Name"
                  name="Last Name"
                />
                <q-input
                  v-model="form.email"
                  label="Email"
                  name="Email"
                />
                <q-input
                  v-model="form.password"
                  label="Password"
                  name="password"
                  type="password"
                />

                <div>
                  <q-btn
                    class="full-width fredoka"
                    color="primary"
                    label="Register"
                    rounded
                    type="submit"
                    :loading="loading"
                  ></q-btn>

                  <div class="q-mt-lg">
                    <div class="q-mt-sm">
                      Already have an account?
                      <router-link
                        class="text-primary"
                        :to="{ name: 'AccountLogin' }"
                      >Login</router-link>
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
import { registration } from 'src/supabase/auth';

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar'

import { ISignUp } from 'src/@types/supabase_auth';

const router = useRouter()
const $q = useQuasar()

const form = reactive<ISignUp>({
  lastName: '',
  firstName: '',
  email: '',
  password: ''
})
const loading = ref<boolean>(false)

const submit = () => {
  loading.value = true

  registration(form)
    .then((error) => {
      if (!error) {
        router.push('login')
      }

      loading.value = false
    })
}
</script>
src/supabase/auth
