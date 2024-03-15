<template>
  <div
    ref="rootElement"
    class="calendar"
  >
    <calendar-view
      :show-date="props.date"
      :starting-day-of-week="1"
      class="calendar__overview"
      @click-date="handleClickDay"
    >
      <!-- <template #day-header="props">
        [day-header slot]
        <pre>{{ props }}</pre>
      </template> -->

      <template #day-content="{ day }">
        <div class="calendar__day-content">
          <template v-for="(entity, i) in getEntities(day)">
            <q-chip
              v-if="i < 3"
              :key="`entity-chip-${i}`"
              square
              color="yellow"
              text-color="black"
              size="sm"
              class="calendar__entity"
            >
              {{ entity.name }} ({{ entity.amount }})
            </q-chip>
            <q-chip
              v-if="i === 3"
              :key="`entity-chip-${i}`"
              square
              text-color="black"
              size="xs"
              class="calendar__entity calendar__entity--dots"
            >...</q-chip>
          </template>
        </div>
      </template>
    </calendar-view>
  </div>
</template>

<script
  lang="ts"
  setup
>
import { ref, defineProps, computed } from 'vue'
import { ICalendarProps, } from 'src/@types/components';
import { CalendarView } from 'vue-simple-calendar';
import "vue-simple-calendar/dist/style.css"
import dayjs from 'dayjs';

const props = defineProps<ICalendarProps>()

const emits = defineEmits<{
  (e: 'clickDay', value: Date): void
}>()

const rootElement = ref<HTMLElement | null>(null)

const handleClickDay = (date: Date) => {
  if (dayjs(date).month() !== dayjs(props.date).month()) return

  emits('clickDay', date);
}

const getEntities = (day: Date) => {
  return props.entities?.filter((entity) => {
    return dayjs(entity.date).isSame(dayjs(day), 'day')
  }) || []
}
</script>

<style lang="scss">
.calendar__table {
  width: 100%;
  border-collapse: collapse;
}

.calendar .cv-week {
  min-height: 140px;
  max-height: 120px;
}

.calendar__week-day,
.calendar .cv-header-day {
  font-weight: 600;
  text-align: center;

  padding: 6px;
  border: 1px solid $primary;
  background: $primary;
  color: white;
  text-transform: capitalize;
}

.calendar__day,
.calendar .cv-day {
  padding: 6px;
  height: 120px;

  transition: background-color .3s;
}

.calendar__day:not(.calendar__day--not-current):hover,
.calendar .cv-day:not(.outsideOfMonth):hover {
  cursor: pointer;
  background: $blue-1;
  transition: background-color .15s;
}

.calendar__day-wrap,
.calendar .cv-day {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;

  position: relative;

  overflow: hidden;
}

.calendar__day--not-current,
.calendar .cv-day.outsideOfMonth {
  background: $blue-grey-1;
}

.calendar__number,
.calendar .cv-day-number {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 24px;
  height: 24px;

  line-height: 1;
}

.calendar__day--today .calendar__number,
.calendar .cv-day.today .cv-day-number {
  flex-shrink: 0;

  color: white;

  background-color: $red;
  border-radius: 50%;
}

.calendar__day-content {
  display: block;

  flex-shrink: 1;
}

.calendar__entity {
  display: inline-block;
  width: 100%;
  margin-inline: 0;
}

.calendar__entity--dots {
  width: auto;
  margin-bottom: 0;
}

.calendar .q-chip__content {
  text-overflow: ellipsis;
  overflow: hidden;
  display: inline;
}
</style>
