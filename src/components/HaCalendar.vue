<template>
  <div
    ref="rootElement"
    class="calendar q-py-md"
  >
    <calendar-view
      :show-date="props.date"
      :starting-day-of-week="1"
      class="calendar__overview"
    >
      <!-- <template #day-header="props">
        [day-header slot]
        <pre>{{ props }}</pre>
      </template> -->

      <template #day-content="{ day }">
        <!-- <pre>{{ props }}</pre> -->
        <div class="calendar__day-content">
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
import { ICalendarProps } from 'src/@types/components';
import { CalendarView } from 'vue-simple-calendar';
import "vue-simple-calendar/dist/style.css"

const props = defineProps<ICalendarProps>()

const rootElement = ref<HTMLElement | null>(null)
</script>

<style lang="scss">
.calendar__table {
  width: 100%;
  border-collapse: collapse;
}

.cv-week {
  min-height: 120px;
  max-height: 120px;
}

.calendar__week-day,
.cv-header-day {
  font-weight: 600;
  text-align: center;

  padding: 6px;
  border: 1px solid $primary;
  background: $primary;
  color: white;
  text-transform: capitalize;
}

.calendar__day,
.cv-day {
  // border: 1px solid $blue-grey-2;
  padding: 6px;
  height: 120px;

  transition: background-color .3s;
}

.calendar__day:not(.calendar__day--not-current):hover,
.cv-day:not(.outsideOfMonth):hover {
  cursor: pointer;
  background: $blue-1;
  transition: background-color .15s;

  .calendar__day-wrap:after,
  &:after {
    display: inline-flex;
  }
}

.calendar__day-wrap,
.cv-day {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;

  position: relative;
}

.calendar__day-wrap:after,
.cv-day:after {
  display: none;

  content: "\e145";
  font-family: "Material Icons";
  font-size: 48px;
  line-height: 1;
  color: $primary;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.calendar__day--not-current,
.cv-day.outsideOfMonth,
{
background: $blue-grey-1;
}

.calendar__number,
.cv-day-number {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 24px;
  height: 24px;

  line-height: 1;
}

.calendar__day--today .calendar__number,
.cv-day.today .cv-day-number {
  color: white;

  background-color: $red;
  border-radius: 50%;
}
</style>
