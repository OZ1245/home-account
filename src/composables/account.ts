import { LocalStorage } from "quasar";
import { uploadAvatar as apiUploadAvatar, updateAccount, fetchAccountData, fetchAvatar } from 'src/supabase/account'
import { getObjectUrl } from 'src/supabase/storage'

export function useAccount () {
  const authData = JSON.parse(LocalStorage.getItem(process.env.VUE_APP_SUPABASE_TOKEN_NAME as string) as string)

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

  const getAvatar = async () => {
    let url = ''

    const avatar = await fetchAvatar()
    console.log('avatar:', avatar);


    if (!avatar.error) {
      url = await getObjectUrl({
        bucketName: 'avatars',
        path: avatar.data[0].avatar
      })
        .then(({ data }) => data.publicUrl)
    }

    return url
  }

  return {
    uploadAvatar,
    getFullAccountData,
    getAvatar
  }
}
