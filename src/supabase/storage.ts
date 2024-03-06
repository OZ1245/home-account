import { supabase } from "./client";

interface IFetchObject {
  bucketName: string
  path: string
}

export const getObjectUrl = async ({ bucketName, path }: IFetchObject): Promise<any> => {
  return await supabase.storage.from(bucketName)
    .getPublicUrl(path)
}
