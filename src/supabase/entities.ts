import { LocalStorage } from "quasar";
import { supabase } from "./client";
import { IEntity, IAddEntity, IUpdateEntity } from 'src/@types/supabase_entity'
import { IPeriod } from 'src/@types/common'

const authData = JSON.parse(LocalStorage.getItem('sb-127-auth-token') as string)

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

export const deleteEntity = async (uuid: string): Promise<any> => {
  return await supabase.from('entities')
    .delete()
    .eq('uuid', uuid)
}
