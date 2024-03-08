import { LocalStorage } from "quasar";
import { supabase } from "./client";
import { IAddEntity, IUpdateEntity } from 'src/@types/supabase_entity'

interface IEntity {
  uuid: string
  created_at: string
  updated_at: string
  date: string
  name: string
  amount: number
  note: string
  owner: string
}

const authData = JSON.parse(LocalStorage.getItem('sb-127-auth-token') as string)

export const fetchEntity = async (date: string) => {
  return await supabase.from('entities')
    .select('*')
    .eq('owner', authData.user.id)
    .eq('date', date)
    .then((response) => response)
}

export const fetchEntities = async () => {
  return await supabase.from('entities')
    .select('*')
    .eq('owner', authData.user.id)
    .then((response) => response)
}

export const addEntity = async (payload: IAddEntity) => {
  return await supabase.from('entity')
    .upsert({
      ...payload,
      owner: authData.user.id
    })
    .select()
}

export const updateEntity = async (payload: IUpdateEntity) => {
  return await supabase.from('entity')
    .update(payload)
    .eq('owner', authData.user.id)
    .select()
}

export const deleteEntity = async (uuid: string) => {
  return await supabase.from('entity')
    .delete()
    .eq('uuid', uuid)
}
