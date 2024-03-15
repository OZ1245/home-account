import { supabase } from "./client";
import { LocalStorage, Notify } from "quasar";
import { IBudget } from 'src/@types/supabase'

const authData = JSON.parse(LocalStorage.getItem(process.env.VUE_APP_SUPABASE_TOKEN_NAME as string) as string)

/**
 * Бюджет за месяц
 * @param {string} date Дата формата 'YYYY MM'
 * @returns {Promise<IBudget>} Данные бюджета за месяц
 */
export const fetchBudget = async (date: string): Promise<IBudget | any> => {
  return await supabase.from('budget')
    .select('*')
    .eq('date', date)
    .eq('owner', authData.user.id)
}

/**
 * Сохранение бюджета месяца
 * @param {IBudget} payload Обязательные параметры:
 * @param {string} date Дата формата 'YYYY MM'
 * @param {IBudgetData} datа Данные бюджета:
 * @param {IBudgetDataItem} prepayment :
 * @param {IBudgetDataItem} wage :
 * @param {number} value Значение
 * @param {string} date Дата формата 'YYYY-MM-DD'
 * @returns {Promise<IBudget>} Созданный (измененный) беджет на месяц
 */
export const updateBudget = async (payload: IBudget): Promise<IBudget | any> => {
  const { date, data } = payload

  if (!date || !data) {
    const error = 'Не заполнены обязательные поля'

    Notify.create({
      message: error,
      type: 'negative'
    })

    return { error }
  }

  return await supabase.from('budget')
    .upsert({
      ...payload,
      owner: authData.user.id
    })
    .select()
}

export const deleteBudget = async (date: string): Promise<any> => {
  return await supabase.from('budget')
    .delete()
    .eq('date', date)
    .eq('owner', authData.user.id)
}
