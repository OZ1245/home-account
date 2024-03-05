import { supabase } from './client.js'

interface ISignUpPayload {
  email: string,
  password: string
  firstName: string
  lastName?: string
}

interface INewAccountData {
  uuid: string
  firstName: string
  lastName?: string
}

export const registration = async ({ email, password, firstName, lastName }: ISignUpPayload): Promise<any> => {
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
      .then((response) => {
        return response
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
