import { LocalStorage } from "quasar";
import { supabase } from "./client";

export const fetchAccountData = async () => {
  const authData = JSON.parse(LocalStorage.getItem('sb-127-auth-token') as string)

  return await supabase.from('account')
    .select('*')
    .eq('user_id', authData.user.id)
    .then(({ data }) => {
      if (data) {
        const { avatar, created_at, first_name, last_name } = data[0];

        return {
          avatar,
          email: authData.user.email,
          createdAt: created_at,
          firstName: first_name,
          lastName: last_name,
        }
      }
    })
}
