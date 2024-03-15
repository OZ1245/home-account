import { createClient } from "@supabase/supabase-js";

// const url = `https://${process.env.VUE_APP_SUPABASE_PROJECT_ID}.supabase.co`
const supabaseUrl = process.env.VUE_APP_SUPABASE_LOCAL_HOST
// const key = process.env.VUE_APP_SUPABASE_KEY
const supabaseKey = process.env.VUE_APP_SUPABASE_ANON_KEY
const storageKey = process.env.VUE_APP_SUPABASE_TOKEN_NAME

export const supabase = createClient(
  supabaseUrl as string,
  supabaseKey as string,
  {
    auth: {
      storageKey: storageKey
    }
  }
)
