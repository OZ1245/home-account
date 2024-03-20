import { boot } from 'quasar/wrappers';
import dayjs from "dayjs"

export default boot(({ app }) => {
  const globalDayjs: any = dayjs

  app.config.globalProperties.$axios = globalDayjs;

  app.use(globalDayjs)
})
