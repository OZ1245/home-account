import { createClient } from "@supabase/supabase-js";

// const url = `https://${process.env.VUE_APP_SUPABASE_PROJECT_ID}.supabase.co`
const url = process.env.VUE_APP_SUPABASE_LOCAL_HOST
// const key = process.env.VUE_APP_SUPABASE_KEY
const key = process.env.VUE_APP_SUPABASE_ANON_KEY

export const supabase = createClient(url, key)
