<template>
  <div
    ref="rootElement"
    class="calendar q-py-md"
    v-html="HTMLCalendar"
  >
  </div>
</template>

<script
  lang="ts"
  setup
>
import { ref, withDefaults, defineProps, computed } from 'vue'
import dayjs from 'dayjs'
import { ICalendarProps } from 'src/@types/components';

const props = withDefaults(defineProps<ICalendarProps>(), {
  month: dayjs().month(),
  year: dayjs().year()
})

const rootElement = ref<HTMLElement | null>(null)
const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const HTMLCalendar = ref<string>('')

const currentDay = computed((): number | null => (
  (props.month === dayjs().month()) ? dayjs().date() : null
))

const drawCalendar = (y: number, m: number) => {
  var d = new Date()
    // Первый день недели в выбранном месяце
    , firstDayOfMonth = new Date(y, m, 7).getDay()
    // Последний день выбранного месяца
    , lastDateOfMonth = new Date(y, m + 1, 0).getDate()
    // Последний день предыдущего месяца
    , lastDayOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();
  var html = '<table class="calendar__table">';
  // заголовок дней недели
  html += '<tr>';
  for (var i = 0; i < daysOfWeek.length; i++) {
    html += '<td class="calendar__week-day">' + daysOfWeek[i] + '</td>';
  }
  html += '</tr>';
  // Записываем дни
  var i = 1;
  do {
    var dow = new Date(y, m, i).getDay();
    // Начать новую строку в понедельник
    if (dow == 1) {
      html += '<tr>';
    }
    // Если первый день недели не понедельник показать последние дни предыдущего месяца
    else if (i == 1) {
      html += '<tr>';
      var k = lastDayOfLastMonth - firstDayOfMonth + 1;
      for (var j = 0; j < firstDayOfMonth; j++) {
        html += '<td class="calendar__day calendar__day--not-current"><div class="calendar__day-wrap">' + k + '</div></td>';
        k++;
      }
    }
    // Записываем текущий день в цикл
    var chk = new Date();
    var chkY = chk.getFullYear();
    var chkM = chk.getMonth();
    if (chkY == props.year && chkM == props.month && i == currentDay.value) {
      html += `
        <td class="calendar__day calendar__day--today">
          <div class="calendar__day-wrap">
            <span class="calendar__number">${i}</span>
          </div>
        </td>`;
    } else {
      html += `
        <td class="calendar__day">
          <div class="calendar__day-wrap">
            <span class="calendar__number">${i}</span>
          </div>
        </td>`;
    }
    // закрыть строку в воскресенье
    if (dow == 0) {
      html += '</tr>';
    }
    // Если последний день месяца не воскресенье, показать первые дни следующего месяца
    else if (i == lastDateOfMonth) {
      var k = 1;
      for (dow; dow < 7; dow++) {
        html += '<td class="calendar__day calendar__day--not-current"><div class="calendar__day-wrap">' + k + '</div></td>';
        k++;
      }
    }
    i++;
  } while (i <= lastDateOfMonth);
  // Конец таблицы
  html += '</table>';
  // Записываем HTML в div
  HTMLCalendar.value = html;
}

drawCalendar(props.year, props.month)
</script>

<style lang="scss">
.calendar__table {
  width: 100%;
  border-collapse: collapse;
}

.calendar__week-day {
  font-weight: 600;
  text-align: center;

  padding: 6px;
  border: 1px solid $primary;
  background: $primary;
  color: white;
}

.calendar__day {
  border: 1px solid $blue-grey-2;
  padding: 6px;
  height: 120px;

  transition: background-color .3s;
}

.calendar__day:not(.calendar__day--not-current):hover {
  cursor: pointer;
  background: $blue-1;
  transition: background-color .15s;

  .calendar__day-wrap:after {
    display: inline-flex;
  }
}

.calendar__day-wrap {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;

  position: relative;
}

.calendar__day-wrap:after {
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

.calendar__day--not-current {
  background: $blue-grey-1;
}

.calendar__number {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 24px;
  height: 24px;

  line-height: 1;
}

.calendar__day--today .calendar__number {
  color: white;

  background-color: $red;
  border-radius: 50%;
}
</style>
