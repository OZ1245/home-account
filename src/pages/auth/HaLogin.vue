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
                ref="form"
                class="q-gutter-md"
                @submit="submit"
              >
                <q-input
                  v-model="user.email"
                  label="Email"
                  name="Email"
                />

                <q-input
                  v-model="user.password"
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

<script setup>
import { ref, reactive } from 'vue'

const user = reactive({
  email: null,
  password: null
})

const form = ref(null)

const submit = async () => {
  if (form.value.validate()) {

  }
}
</script>
