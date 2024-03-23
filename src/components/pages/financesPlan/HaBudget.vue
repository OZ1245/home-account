<template>
  <div class="row">
    <div class="col">
      <q-list bordered>
        <q-expansion-item
          expand-separator
          label="Бюджет"
        >
          <q-card>
            <q-card-section>
              <q-form>
                <div class="row q-gutter-md">
                  <div class="col">
                    <div class="row q-gutter-md">
                      <div class="col">
                        <q-input
                          v-model="form.prepayment.value"
                          label="Аванс"
                          mask="#.##"
                          fill-mask="0"
                          reverse-fill-mask
                          required
                        />
                      </div>
                      <div class="col">
                        <ha-datepicker
                          v-model="form.prepayment.date"
                          label="Дата получения"
                        />
                      </div>
                    </div>
                    <div class="row q-gutter-md">
                      <div class="col">
                        <q-input
                          v-model="form.wage.value"
                          label="Заработная палата"
                          mask="#.##"
                          fill-mask="0"
                          reverse-fill-mask
                          required
                        />
                      </div>
                      <div class="col">
                        <ha-datepicker
                          v-model="form.wage.date"
                          label="Дата получения"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col self-center">
                    <q-input
                      v-model="totalSalary"
                      label="Итого (оклад)"
                      readonly
                    />
                  </div>
                </div>
              </q-form>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                icon="done"
                color="primary"
                label="Save"
                :disable="!isValid"
                @click="handleSave"
              />
            </q-card-actions>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>
  </div>
</template>

<script
  lang="ts"
  setup
>
import { computed, toRef } from 'vue'
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'

import HaDatepicker from 'src/components/common/HaDatepicker';

import { IBudget } from 'src/@types/supabase';
import { IBudgetProps } from 'src/@types/components'

dayjs.extend(customParseFormat)

const props = defineProps<IBudgetProps>()

const emits = defineEmits<{
  (e: 'save', value: IBudget): void
}>()

const form = toRef(props, 'data')

const totalSalary = computed((): number => (
  (form.value.prepayment.value.length && form.value.wage.value.length)
    ? parseFloat(form.value.prepayment.value) + parseFloat(form.value.wage.value)
    : 0
))
const isValid = computed((): boolean => {
  if (!form.value.prepayment.value.length) {
    return false
  }

  if (!form.value.wage.value.length) {
    return false
  }

  return true
})

const handleSave = () => {
  let data: IBudget = {
    date: props.date,
    data: {
      prepayment: {
        value: form.value.prepayment.value,
        date: dayjs(form.value.prepayment.date, 'DD.MM.YYYY').format('YYYY-MM-DD')
      },
      wage: {
        value: form.value.wage.value,
        date: dayjs(form.value.wage.date, 'DD.MM.YYYY').format('YYYY-MM-DD')
      },
    }
  }

  if (props.uuid) {
    data = {
      ...data,
      uuid: props.uuid
    }
  }

  emits('save', data)
}
</script>
