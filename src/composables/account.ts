import { LocalStorage } from "quasar";
import { uploadAvatar as apiUploadAvatar, updateAccount, fetchAccountData } from 'src/supabase/account'
import { getObjectUrl } from 'src/supabase/storage'

export function useFiles () {
  const authData = JSON.parse(LocalStorage.getItem('sb-127-auth-token') as string)

  const uploadAvatar = async (file: File) => {
    return await apiUploadAvatar({
      fileName: file.name,
      file
    })
      .then(async (data) => {
        return await updateAccount({
          avatar: data.path
        })
        .then(({ error }) => {
          return error
        })
      })
  }

  const getFullAccountData = () => {
    return fetchAccountData()
      .then(async ({ data, error }) => {
        if (data) {
          const { avatar, created_at, first_name, last_name } = data[0];

          const avatarUrl = await getObjectUrl({
            bucketName: 'avatars',
            path: avatar
          })
          .then(({ data }) => data.publicUrl)

          return {
            avatar: avatarUrl,
            email: authData.user.email,
            createdAt: created_at,
            firstName: first_name,
            lastName: last_name,
          }
        }

        return error
      })
  }

  return {
    uploadAvatar,
    getFullAccountData
  }
}
