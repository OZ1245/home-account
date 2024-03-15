import { Notify } from 'quasar'
import { supabase } from './client.js'

import { ISignUp, ILogin } from 'src/@types/supabase'

interface INewAccountData {
  uuid: string
  firstName: string
  lastName?: string
}

const url = process.env.VUE_APP_BASE_URL

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

export const resetPassword = async (email: string): Promise<any> => {
  return await supabase.auth.resetPasswordForEmail(
    email,
    { redirectTo: `${url}/auth/update-password` }
  )
  .then(({ error, data }) => {
    return error
  })
  .catch(({ message }) => {
    throw message
  })
}

export const updatePassword = async (password: string): Promise<any> => {
  return await supabase.auth.updateUser(
    { password },
    { emailRedirectTo: url }
  )
  .then(({ error }) => {
    if (error) {
      Notify.create({
        message: 'Новый пароль не должен совпадать со старым.',
        type: 'negative'
      })
    }

    return error
  })
  .catch(({ message }) => {
    throw message
  })
}

export const verifyPassword = async (password: string): Promise<any> => {
  return await supabase.rpc('verify_user_password', { password })
    .then((response) => {
      return response
    })
}

export const logout = async (): Promise<any> => {
  return await supabase.auth.signOut()
    .then(({ error }) => {
      return error
    })
    .catch(({ message }) => {
      throw message
    })
}

