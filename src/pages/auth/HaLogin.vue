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
                    Login</div>
                </div>
              </div>

              <q-form
                class="q-gutter-md"
                @submit="submit"
              >
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
                    label="Login"
                    rounded
                    type="submit"
                  ></q-btn>

                  <div class="q-mt-lg">
                    <div class="q-mt-sm">
                      Don't have an account yet?
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
import { login } from 'app/supabase/auth';
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const form = reactive({
  email: null,
  password: null
})
const loading = ref<boolean>(false)

const submit = () => {
  loading.value = true

  login(form)
    .then((error) => {
      if (!error) {
        router.push({ name: 'Home' })
      }

      loading.value = false
    })
}
</script>
