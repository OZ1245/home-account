import { LocalStorage } from "quasar";
import { supabase } from "./client";
import { IEntity } from 'src/@types/supabase'
import { IPeriod } from 'src/@types/common'

const authData = JSON.parse(LocalStorage.getItem(process.env.VUE_APP_SUPABASE_TOKEN_NAME as string) as string)

export const fetchEntityByDate = async (date: string): Promise<IEntity | any> => {
  return await supabase.from('entities')
    .select('*')
    .eq('owner', authData.user.id)
    .eq('date', date)
}

export const fetchEntities = async (): Promise<IEntity[] | any> => {
  return await supabase.from('entities')
    .select('*')
    .eq('owner', authData.user.id)
}

/**
 * Получить все сущности за период
 * @param {string} start Дата начала периода в формате ISO string (dayjs().toISOString())
 * @param {string} end Дата конца периода в формате ISO string (dayjs().toISOString())
 * @returns {Promise<IEntity[]>} Массив сущностей
 */
export const fetchEntitiesByPeriod = async ({ start, end }: IPeriod): Promise<IEntity[] | any> => {
  return await supabase.from('entities')
    .select('*')
    .gte('date', start)
    .lte('date', end)
}

export const updateEntity = async (payload: IEntity): Promise<IEntity[] | any> => {
  return await supabase.from('entities')
    .upsert({
      ...payload,
      owner: authData.user.id
    })
    .select()
}

export const updateEntities = async (payload: IEntity[]): Promise<IEntity[] | any> => {
  let upsertPayload: IEntity[] = []
  let insertPayload: IEntity[] = []

  payload.map((entity) => {
    if (entity.uuid) {
      upsertPayload = [
        ...upsertPayload,
        {
          ...entity,
          owner: authData.user.id
        }
      ]
    } else {
      insertPayload = [
        ...insertPayload,
        {
          ...entity,
          owner: authData.user.id
        }
      ]
    }
  })

  const upsertResponse = supabase.from('entities')
    .upsert(upsertPayload)
    .select()

  const insertResponse = supabase.from('entities')
    .insert(insertPayload)
    .select()

  return Promise.all([upsertResponse, insertResponse])
    .then((responses) => {
      return responses
    })
}

export const deleteEntity = async (uuid: string): Promise<any> => {
  return await supabase.from('entities')
    .delete()
    .eq('uuid', uuid)
}

export const deleteEntities = async (uuidList: string[]): Promise<any> => {
  return await supabase.from('entities')
    .delete()
    .in('uuid', uuidList)
}
