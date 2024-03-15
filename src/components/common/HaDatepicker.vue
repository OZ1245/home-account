<template>
  <q-input
    :model-value="value"
    :label="props.label"
    mask="##.##.####"
    :rules="[v => !/(\\d{2})\.(\\d{2})\.(\\d{4})/.test(v)]"
  >
    <template v-slot:append>
      <q-icon
        name="event"
        class="cursor-pointer"
      >
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            :model-value="value"
            mask="DD.MM.YYYY"
            @update:model-value="handleUpdateModelValue"
          >
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                label="Close"
                color="primary"
                flat
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script
  lang="ts"
  setup
>
import { computed } from 'vue'

// TODO: Разбор строки формата для составления маски и регулярного выражения
const props = defineProps<{
  modelValue?: string | null
  label?: string
  format?: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const value = computed((): string => props.modelValue)

const handleUpdateModelValue = (value: string) => {
  emits('update:modelValue', value)
}
</script>
