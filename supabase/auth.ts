import { LocalStorage, Notify } from 'quasar'
import { supabase } from './client.js'

import { ISignUp, ILogin } from 'src/@types/supabase_auth'

interface INewAccountData {
  uuid: string
  firstName: string
  lastName?: string
}

export const registration = async ({ email, password, firstName, lastName }: ISignUp): Promise<any> => {
  return await supabase.auth.signUp({
    email,
    password
  })
  .then(({ data, error }) => {
    if (!error && data.user) {
      return setNewAccountData({
        uuid: data.user.id,
        firstName,
        lastName
      })
      .then(({ error }) => {
        if (!error) {
          Notify.create({
            message: 'Вы успешно зарегистрировались. Теперь можете войти под своим email.',
            type: 'positive'
          })
        } else {
          Notify.create({
            message: error.message,
            type: 'negative'
          })
        }

        return error
      })
      .catch(({ message }) => {
        throw message
      })
    }
  })
  .catch(({ message }) => {
    throw message
  })
}

const setNewAccountData = async ({ uuid, firstName, lastName }: INewAccountData): Promise<any> => {
  return await supabase.from('account')
    .insert([
      {
        user_id: uuid,
        first_name: firstName,
        last_name: lastName
      }
    ])
    .select()
}

export const login = async ({ email, password }: ILogin): Promise<any> => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  })
  .then(({ data, error }) => {
    console.log('login response data:', data);
    LocalStorage.set('homeAccount/token', data.session?.access_token)

    if (error) {
      Notify.create({
        message: error.message,
        type: 'negative'
      })
    }

    return error
  })
  .catch(({ message }) => {
    throw message
  })
}
