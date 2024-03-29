import { LocalStorage } from "quasar";
import { supabase } from "./client";
import { IAccount, IUploadAvatar } from 'src/@types/supabase'

interface IUpdateAccount {
  first_name?: string,
  last_name?: string,
  avatar?: string
}

const authData = JSON.parse(LocalStorage.getItem(process.env.VUE_APP_SUPABASE_TOKEN_NAME as string) as string)

export const fetchAccountData = async (): Promise<IAccount | any> => {
  return await supabase.from('account')
    .select('*')
    .eq('user_id', authData.user.id)
}

export const fetchAvatar = async (): Promise<string | any> => {
  return await supabase.from('account')
    .select('avatar')
    .eq('user_id', authData.user.id)
}

export const uploadAvatar = async ({ fileName, file }: IUploadAvatar): Promise<any> => {
  return await supabase.storage.from('avatars')
    .upload(fileName, file, {
      upsert: true
    })
    .then(({ data, error }) => {
      return data
    })
    .catch(({ message }) => {
      throw message
    })
}

export const updateAccount = async (payload: IUpdateAccount): Promise<any> => {
  return await supabase.from('account')
    .update(payload)
    .eq('user_id', authData.user.id)
    .select()
}
